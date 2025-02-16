import React, { useRef, useEffect, useState } from 'react';
import { Html } from '@react-three/drei';

const Projects = ({ isAdmin, language }) => {
  const [projects, setProjects] = useState([]);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [positions, setPositions] = useState([]);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [date, setDate] = useState('');
  const [photo, setPhoto] = useState(null);
  const [secondaryPhoto, setSecondaryPhoto] = useState(null);

  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const projectsContainerRef = useRef();
  const dropZoneRef = useRef();
  const phoneRef = useRef();
  const adminPanelRef = useRef();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 968);

  // Fetch projects data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/projects`);
        const data = await response.json();
        setProjects(data);

        // Generate random positions for each project once when data is fetched
        const randomPositions = generateUniquePositions(data.length);
        setPositions(randomPositions);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      setIsMobile(window.innerWidth <= 968);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const width = windowSize.width * 0.8; // Increased width
  const height = windowSize.height * 0.8; // Increased height

  // Function to generate random positions within the container
  const getRandomPosition = () => {
    return {
      top: Math.random() * (height) + 'px',
      left: Math.random() * (width) + 'px',
    };
  };

  // Function to check if two positions overlap
  const isOverlap = (pos1, pos2) => {
    return (
      Math.abs(parseFloat(pos1.top) - parseFloat(pos2.top)) < 400 &&
      Math.abs(parseFloat(pos1.left) - parseFloat(pos2.left)) < 400
    );
  };

  // Generate unique positions for each project
  const generateUniquePositions = (numProjects) => {
    const generatedPositions = [];
    let tries = 0;

    for (let i = 0; i < numProjects; i++) {
      let position;
      let overlapFound = true;
      while (overlapFound && tries < 100) {
        position = getRandomPosition();
        // eslint-disable-next-line no-loop-func
        overlapFound = generatedPositions.some((existingPos) => isOverlap(existingPos, position));
        tries++;
      }
      generatedPositions.push(position);
    }
    return generatedPositions;
  };

  // Handle Pointer Down (start dragging)
  const handlePointerDown = (index, e) => {
    if (!positions[index]) return; // Skip if position is undefined
  
    setDraggingIndex(index);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX, y: clientY });
    setStartPosition({
      x: parseFloat(positions[index].left),
      y: parseFloat(positions[index].top),
    });
  };

  // Handle Pointer Move (dragging)
  const handlePointerMove = (e) => {
    if (draggingIndex === null) return;
  
    // Prevent default behavior to avoid scrolling
    if (e.touches) {
      e.preventDefault();
    }
  
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
  
    const scalingFactor = 1.73; // Adjust this value if needed
    const newLeft = startPosition.x + deltaX * scalingFactor;
    const newTop = startPosition.y + deltaY * scalingFactor;
  
    const { width: containerWidth, height: containerHeight } = getContainerDimensions();
    const constrainedTop = Math.min(Math.max(0, newTop), containerHeight * 1.5);
    const constrainedLeft = Math.min(Math.max(0, newLeft), containerWidth * 1.5);
  
    const newPositions = [...positions];
    newPositions[draggingIndex] = {
      top: `${constrainedTop}px`,
      left: `${constrainedLeft}px`,
    };
    setPositions(newPositions);
  };

  // Handle Pointer Up (stop dragging)
  const handlePointerUp = (e) => {
    if (draggingIndex !== null) {
      const dropZone = dropZoneRef.current.getBoundingClientRect();
      const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

      if (
        clientX >= dropZone.left &&
        clientX <= dropZone.right &&
        clientY >= dropZone.top &&
        clientY <= dropZone.bottom
      ) {
        window.open(`${process.env.PUBLIC_URL}/#/project/${projects[draggingIndex].id}`, '_blank');
      }
    }
    setDraggingIndex(null);
  };

  const handleGoToProject = (projectId) => {
    // Assuming you're using React Router to navigate to a project's page
    window.open(`${process.env.PUBLIC_URL}/#/project/${projectId}`, '_blank');
  };
  

  // Attach event listeners for both mouse and touch events
  useEffect(() => {
    const handleMove = (e) => handlePointerMove(e);
    const handleUp = (e) => handlePointerUp(e);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggingIndex, dragStart, startPosition]);

  const getContainerDimensions = () => {
    if (projectsContainerRef.current) {
      const { width, height } = projectsContainerRef.current.getBoundingClientRect();
      return { width, height };
    }
    return { width: 0, height: 0 };
  };

  // Handle form submission for creating a new project
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('skills_required', skillsRequired);
    formData.append('date', date);
    formData.append('photo', photo);
    if (secondaryPhoto) {
      formData.append('secondary_photo', secondaryPhoto);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/project`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        // Reset form
        setTitle('');
        setDescription('');
        setSkillsRequired('');
        setDate('');
        setPhoto(null);
        setSecondaryPhoto(null);
        setShowAddProjectForm(false);

        // Refetch projects to update the list
        const fetchResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/projects`);
        const projectsData = await fetchResponse.json();
        setProjects(projectsData);

        const newPosition = getRandomPosition();
        setPositions((prevPositions) => [...prevPositions, newPosition]);
      } else {
        const errorData = await response.json();
        alert(`Failed to create project: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form.');
    }
  };

  // Handle project deletion
  const handleDeleteProject = async (projectId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/project/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== projectId)
        );
        alert('Project deleted successfully!');
      } else {
        alert('Failed to delete project.');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('An error occurred while deleting the project.');
    }
  };

  // Handle project update
  const handleUpdateProject = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('skills_required', skillsRequired);
    formData.append('date', date);
    if (photo) {
      formData.append('photo', photo);
    }
    if (secondaryPhoto) {
      formData.append('secondary_photo', secondaryPhoto);
    }

    formData.append('_method', 'PUT');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/project/${editingProject.id}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        // Reset form
        setTitle('');
        setDescription('');
        setSkillsRequired('');
        setDate('');
        setPhoto(null);
        setSecondaryPhoto(null);
        setEditingProject(null);

        // Refetch projects to update the list
        const fetchResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/projects`);
        const projectsData = await fetchResponse.json();
        setProjects(projectsData);
      } else {
        const errorData = await response.json();
        alert(`Failed to update project: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('An error occurred while updating the project.');
    }
  };

  // Handle clicking the "Update" button
  const handleEditProject = (project) => {
    if (editingProject && editingProject.id === project.id) {
      setEditingProject(null);
    } else {
      setEditingProject(project);
      setTitle(project.title);
      setDescription(project.description);
      setSkillsRequired(project.skills_required);
      setDate(project.date);
    }
  };

  const [imageUrls, setImageUrls] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllImages = async () => {
      const urls = {};
  
      try {
        for (const project of projects) {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/storage/${project.photo}`, {
            method: 'GET',
            headers: {
              'Origin': window.location.origin,
              'X-Requested-With': 'XMLHttpRequest',
              'Accept': 'image/*',
            },
          });
  
          if (!response.ok) {
            throw new Error(`Failed to fetch image for project ${project.id}`);
          }
  
          const imageBlob = await response.blob();
          urls[project.id] = URL.createObjectURL(imageBlob);
        }
  
        setImageUrls(urls); // Set all image URLs
      } catch (error) {
        setError('Failed to fetch images.');
        console.error(error);
      }
    };
  
    if (projects.length > 0) {
      fetchAllImages();
    }
  }, [projects]);

  return (
    <>
{isMobile ? (
  <mesh position={[-50, 0, 3]} rotation={[0, Math.PI / 2, 0]}>
    <Html transform>
      <div
        ref={phoneRef}
        style={{
          width: '550px',
          height: '1200px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '30px',
          fontWeight: 'bold',
          color: 'black',
          userSelect: 'none',
          padding: '20px',
          overflowY: 'auto',
        }}
      >
        <h3>Projects List:</h3>
        {projects.length > 0 ? (
          <div style={{ width: '100%' }}>
            {projects.map((project) => (
              <div
                key={project.id}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  padding: '10px',
                  borderRadius: '15px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                  marginBottom: '10px',
                  textAlign: 'center',
                }}
              >
                <img
                  src={imageUrls[project.id]}
                  alt={project.title}
                  style={{
                    marginBottom: '10px',
                    borderRadius: '10px',
                    pointerEvents: 'none',
                    maxWidth: '400px',
                    maxHeight: '200px',
                  }}
                />
                <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{project.title}</p>
                <button
                  onClick={() => handleGoToProject(project.id)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#007bff',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  Go to Project
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>Loading projects...</p>
        )}
      </div>
    </Html>
  </mesh>
      ) : (
        <>
          {/* Drop Zone */}
          <mesh position={[-58, -8, 3]} rotation={[0, Math.PI / 2, 0]}>
            <Html transform>
              <div
                ref={dropZoneRef}
                style={{
                  width: '500px',
                  height: '400px',
                  backgroundColor: 'rgba(102, 235, 109, 0.7)',
                  borderRadius: '60px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '30px',
                  fontWeight: 'bold',
                  color: 'white',
                  userSelect: 'none',
                }}
              >
                Drag and Drop<br />Here to Open Project!
              </div>
            </Html>
          </mesh>
          <mesh position={[-56, 0, 3]} rotation={[0, Math.PI / 2, 0]}>
            <Html transform>
              <div
                ref={projectsContainerRef}
                style={{
                  width: `200vh`,
                  height: '120vh',
                  backgroundColor: 'rgba(255, 255, 255, 0)',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  position: 'relative',
                  borderRadius: '80px',
                  padding: '20px',
                  overflow: 'hidden',
                  userSelect: 'none',
                }}
              >
                {projects.length > 0 && positions.length === projects.length ? (
                  projects.map((project, index) => {
                    const randomPosition = positions[index];
                    if (!randomPosition) return null; // Skip if position is undefined
  
                    return (

                      <div
                        key={project.id}
                        style={{
                          position: 'absolute',
                          top: randomPosition.top,
                          left: randomPosition.left,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          padding: '10px',
                          borderRadius: '15px',
                          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                          width: '400px',
                          textAlign: 'center',
                          cursor: 'grab',
                        }}
                        onMouseDown={(e) => handlePointerDown(index, e)}
                        onTouchStart={(e) => handlePointerDown(index, e)}
                      >
                        <img
                          src={imageUrls[project.id]}
                          alt={project.title}
                          style={{
                            marginBottom: '10px',
                            borderRadius: '10px',
                            pointerEvents: 'none',
                            maxWidth: '400px',
                            maxHeight: '400px',
                          }}
                        />
                        <p style={{ fontSize: '30px', fontWeight: 'bold' }}>{project.title}</p>
                      </div>
                    );
                  })
                ) : (
                  error ? (
                    <p>Error loading projects. Please try again later.</p> // Display error message if error exists
                  ) : (
                    <p>Loading projects...</p> // Display loading message if still loading
                  )
                )}
              </div>
            </Html>
          </mesh>
  
          {isAdmin && (
            <mesh ref={adminPanelRef} position={[-34, 4, 20]} rotation={[0, Math.PI / 2, 0]}>
              <Html transform>
                <div
                  className="projects-list"
                  style={{
                    width: '300px',
                    height: '800px',
                    overflowY: 'auto',
                    padding: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '5px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <h3>Projects:</h3>
                  <button
                    onClick={() => setShowAddProjectForm(!showAddProjectForm)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#007bff',
                      border: 'none',
                      borderRadius: '4px',
                      color: 'white',
                      cursor: 'pointer',
                      marginBottom: '10px',
                    }}
                  >
                    {showAddProjectForm ? 'Hide Form' : 'Add Project'}
                  </button>
                  {showAddProjectForm && (
                    <div
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        padding: '10px',
                        borderRadius: '5px',
                        marginBottom: '10px',
                      }}
                    >
                      <h3>Add New Project</h3>
                      <form
                        onSubmit={handleSubmit}
                        style={{
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <label>Title:</label>
                          <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <label>Description:</label>
                          <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            style={{
                              resize: 'none',
                              width: '90%',
                              height: '100px',
                            }}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <label>Skills Required:</label>
                          <input
                            type="text"
                            value={skillsRequired}
                            onChange={(e) => setSkillsRequired(e.target.value)}
                            required
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <label>Date:</label>
                          <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <label>Photo:</label>
                          <input
                            type="file"
                            onChange={(e) => setPhoto(e.target.files[0])}
                            required
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <label>Secondary Photo (optional):</label>
                          <input
                            type="file"
                            onChange={(e) => setSecondaryPhoto(e.target.files[0])}
                          />
                        </div>
                        <button type="submit">Submit</button>
                      </form>
                    </div>
                  )}
                  {projects.map((project) => (
                    <div key={project.id} className="project">
                      <p>-------------------</p>
                      <h4>{project.title}</h4>
                      <p>
                        <h5>Description:</h5> {project.description}
                      </p>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#FF4C4C',
                          border: 'none',
                          borderRadius: '4px',
                          color: 'white',
                          cursor: 'pointer',
                          marginRight: '10px',
                        }}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleEditProject(project)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#4CAF50',
                          border: 'none',
                          borderRadius: '4px',
                          color: 'white',
                          cursor: 'pointer',
                        }}
                      >
                        {editingProject && editingProject.id === project.id
                          ? 'Hide Form'
                          : 'Update'}
                      </button>
                      {editingProject && editingProject.id === project.id && (
                        <div
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            padding: '10px',
                            borderRadius: '5px',
                            marginTop: '10px',
                          }}
                        >
                          <h3>Update Project</h3>
                          <form
                            onSubmit={handleUpdateProject}
                            style={{
                              width: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px',
                            }}
                          >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                              <label>Title:</label>
                              <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                              />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                              <label>Description:</label>
                              <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                style={{
                                  resize: 'none',
                                  width: '90%',
                                  height: '100px',
                                }}
                              />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                              <label>Skills Required:</label>
                              <input
                                type="text"
                                value={skillsRequired}
                                onChange={(e) => setSkillsRequired(e.target.value)}
                                required
                              />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                              <label>Date:</label>
                              <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                              />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                              <label>Photo:</label>
                              <input
                                type="file"
                                onChange={(e) => setPhoto(e.target.files[0])}
                              />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                              <label>Secondary Photo (optional):</label>
                              <input
                                type="file"
                                onChange={(e) => setSecondaryPhoto(e.target.files[0])}
                              />
                            </div>
                            <button type="submit">Update</button>
                          </form>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Html>
            </mesh>
          )}
        </>
      )}
    </>
  );
}

export default Projects;