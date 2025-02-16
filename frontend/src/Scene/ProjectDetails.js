import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProjectDetails = ({ language }) => {
  const { id } = useParams(); // Get project ID from URL
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/project/${id}`);
        if (!response.ok) throw new Error('Project not found');
        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const [imageUrl, setImageUrl] = useState('');
  const [secondaryImageUrl, setSecondaryImageUrl] = useState('');

  useEffect(() => {
    const fetchImage = async (imagePath, setter) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/storage/${imagePath}`, {
          headers: {
            'Origin': window.location.origin,
            'X-Requested-With': 'XMLHttpRequest',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setter(imageUrl);  // Set the fetched image URL
      } catch (err) {
        console.error(err);
      }
    };

    // Fetch the primary image
    fetchImage(project.photo, setImageUrl);

    // Fetch the secondary image (if it exists)
    if (project.secondary_photo) {
      fetchImage(project.secondary_photo, setSecondaryImageUrl);
    }
  }, [project.photo, project.secondary_photo]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const splitDescription = project.description.split('|');
  const englishDescription = splitDescription[0];
  const frenchDescription = splitDescription[1] || '';

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{project.title}</h1>
      <img
        src={imageUrl}
        alt={project.title}
        style={styles.image}
      />
      <p style={styles.description}>
        {language === 'French' ? frenchDescription : englishDescription}
      </p>
      <p style={styles.skills}>
        
      {language === "French" ? (
                <>
                  Compétences requis:<br/>
                </>
              ) : (
                <>
                  Skills required:<br/>
                </>
              )} 
          {project.skills_required}</p>
      <p style={styles.date}>Date: {new Date(project.date).toDateString()}</p>
      {project.secondary_photo && (
        <img
          src={secondaryImageUrl}
          alt="Secondary"
          style={styles.image}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '50px auto',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: '10px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },
  title: { fontSize: '32px', fontWeight: 'bold', marginBottom: '20px' },
  image: { width: '100%', maxWidth: '500px', borderRadius: '10px', margin: '20px 0' },
  description: { fontSize: '18px', marginBottom: '10px' },
  skills: { fontSize: '16px', fontStyle: 'italic', color: '#555' },
  date: { fontSize: '14px', color: '#777' },
};

export default ProjectDetails;
