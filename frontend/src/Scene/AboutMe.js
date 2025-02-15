import { Html } from '@react-three/drei';
import React, { useRef } from 'react';

const AboutMe = ({ language }) => {
  const planeRef = useRef();

  // Static text for English
  const englishText = {
    aboutMeTitle: "About me",
    aboutMe: `Hi! I'm Justin Morissette, a passionate developer with a love for learning and projects. This is my portfolio where I decided to learn the react Three.js JavaScript library as well as using a Laravel backend, 2 things I had yet to learn. I tried all sorts of different ways to blend 2d and 3d and this is the result.
  
    To me, this portfolio was a learning experience and a way for me to differentiate myself through my style. I have still much to learn, but I am more than willing to learn!
    
    3rd year student in Computer Science at Champlain College Saint-Lambert`,
  
    skillsTitle: "Skills",
    softSkills: ["Long and short-term problem-solving", "Prioritizing tasks", "Team management, leadership, and collaboration", "Cool-headed under pressure", "Friendly and effective communicator"],
    programmingLanguages: ["Python, C#, Java", "JavaScript, TypeScript, PHP, Swift", "CSS, HTML, JSON", "Bash, PowerShell"],
    frameworks: ["Spring, Laravel, ASP.NET", "Bootstrap, jQuery, React"],
    tools: ["Docker Desktop, Linux, Windows", "Cisco Packet Tracer, XAMPP, Ubuntu", "REST APIs"],
    databases: ["SQL Workbench, MongoDB", "PostgreSQL, SQLite", "SSMS (SQL Server Management Studio)"],
    hobbiesTitle: "Hobbies",
    title1: "Climbing",
    title2: "Writing",
    title3: "And starting personal projects!",
    connectWithMe: "Connect With Me",
    downloadCV: "Download My CV",
    contactMe: "Contact Me",
  };
  
  // Static text for French (for example)
  const frenchText = {
    aboutMeTitle: "A propos de moi",
    aboutMe: `Salut! Je suis Justin Morissette, un développeur passionné avec une soif d'apprentissage et de projets. Voici mon portfolio où j'ai décidé d'apprendre la bibliothèque JavaScript React Three.js ainsi que l'utilisation d'un backend Laravel, deux choses que je n'avais pas encore explorées. J'ai essayé différentes façons de mélanger le 2D et le 3D, et voici le résultat.
  
    Pour moi, ce portfolio a été une expérience d'apprentissage et une manière de me différencier par mon style. J'ai encore beaucoup à apprendre, mais je suis plus que prêt à apprendre!
    
    Étudiant en 3ème année en informatique au Collège Champlain Saint-Lambert`,
  
    skillsTitle: "Compétences",
    softSkills: ["Résolution de problèmes à court et long terme", "Priorisation des tâches", "Gestion d'équipe, leadership et collaboration", "Calme sous pression", "Communication amicale et efficace"],
    programmingLanguages: ["Python, C#, Java", "JavaScript, TypeScript, PHP, Swift", "CSS, HTML, JSON", "Bash, PowerShell"],
    frameworks: ["Spring, Laravel, ASP.NET", "Bootstrap, jQuery, React"],
    tools: ["Docker Desktop, Linux, Windows", "Cisco Packet Tracer, XAMPP, Ubuntu", "APIs REST"],
    databases: ["SQL Workbench, MongoDB", "PostgreSQL, SQLite", "SSMS (SQL Server Management Studio)"],
    hobbiesTitle: "Loisirs",
    title1: "Escalade",
    title2: "Écriture",
    title3: "Et démarrer des projets personnels !",
    connectWithMe: "Connectez-vous avec moi",
    downloadCV: "Télécharger mon CV",
    contactMe: "Contactez-moi",
  };
  
  
  // Choose which language to display based on the `language` prop
  const content = language === 'French' ? frenchText : englishText;

  return (
    <mesh ref={planeRef} position={[34, 1, 3]} rotation={[0, -Math.PI / 2, 0]}>
      <Html transform>
        <div
          style={{
            width: '1000px',
            maxWidth: '90vw',
            height: '900px',
            overflowY: 'auto',
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '15px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            fontFamily: 'Arial, sans-serif',
            color: '#333',
          }}
        >
          {/* Image Section */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img
              src={`${process.env.PUBLIC_URL}//images/JustinMorissetteProfile.jpg`}
              alt="Profile"
              style={{
                maxWidth: '300px',
                borderRadius: '50%',
                border: '4px solid #007bff',
              }}
            />
          </div>

          {/* Description Section */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#007bff', marginBottom: '10px' }}>{content.aboutMeTitle}</h3>
            <p style={{ lineHeight: '1.6' }}>
              {content.aboutMe}
            </p>
          </div>

          {/* Skills Section */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#007bff', marginBottom: '10px' }}>{content.skillsTitle}</h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              <li style={{ marginBottom: '5px', fontWeight: 'bold' }}>Soft Skills</li>
              <ul style={{ listStyleType: 'none', paddingLeft: '20px', marginBottom: '10px' }}>
                {content.softSkills.map((skill, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>{skill}</li>
                ))}
              </ul>

              <li style={{ marginBottom: '5px', fontWeight: 'bold' }}>Programming Languages</li>
              <ul style={{ listStyleType: 'none', paddingLeft: '20px', marginBottom: '10px' }}>
                {content.programmingLanguages.map((language, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>{language}</li>
                ))}
              </ul>

              <li style={{ marginBottom: '5px', fontWeight: 'bold' }}>Frameworks & Libraries</li>
              <ul style={{ listStyleType: 'none', paddingLeft: '20px', marginBottom: '10px' }}>
                {content.frameworks.map((framework, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>{framework}</li>
                ))}
              </ul>

              <li style={{ marginBottom: '5px', fontWeight: 'bold' }}>Tools & Platforms</li>
              <ul style={{ listStyleType: 'none', paddingLeft: '20px', marginBottom: '10px' }}>
                {content.tools.map((tool, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>{tool}</li>
                ))}
              </ul>

              <li style={{ marginBottom: '5px', fontWeight: 'bold' }}>Databases</li>
              <ul style={{ listStyleType: 'none', paddingLeft: '20px', marginBottom: '10px' }}>
                {content.databases.map((db, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>{db}</li>
                ))}
              </ul>
            </ul>
          </div>

          {/* Hobbies Section */}
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <h2 style={{ color: '#007bff', marginBottom: '10px' }}>
              {language === 'English' ? englishText.hobbiesTitle : frenchText.hobbiesTitle}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '70%' }}>
                <img src={`${process.env.PUBLIC_URL}/images/climbing.jpg`} alt="Climbing" style={{ maxWidth: '500px', borderRadius: '10px' }} />
                <h3>{language === 'English' ? englishText.title1 : frenchText.title1}</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '70%' }}>
                <h3>{language === 'English' ? englishText.title2 : frenchText.title2}</h3>
                <img src={`${process.env.PUBLIC_URL}/images/writing.jpg`} alt="Writing" style={{ maxWidth: '500px', borderRadius: '10px' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3><b>{language === 'English' ? englishText.title3 : frenchText.title3}</b></h3>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#007bff', marginBottom: '10px' }}>{content.connectWithMe}</h3>
            <a
              href="https://github.com/Justin222993"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginRight: '15px',
                color: '#333',
                textDecoration: 'none',
                fontSize: '18px',
              }}
            >
              GitHub
            </a>
            |
            <a
              href="https://www.linkedin.com/in/justin-morissette/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginLeft: '15px',
                color: '#007bff',
                textDecoration: 'none',
                fontSize: '18px',
              }}
            >
              LinkedIn
            </a>
          </div>

          {/* CV Download Section */}
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <h3 style={{ color: '#007bff', marginBottom: '10px' }}>{content.downloadCV}</h3>
            <a
              href={`${process.env.PUBLIC_URL}/Resume/JustinMorissette-Resume.pdf`} // Replace with your CV file path
              download="Justin_Morissette_CV.pdf"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: '#fff',
                borderRadius: '5px',
                textDecoration: 'none',
                transition: 'background-color 0.3s',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
            >
              Download CV
            </a>
          </div>

          {/* Email Link Section */}
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#007bff', marginBottom: '10px' }}>{content.contactMe}</h3>
            <a
              href="mailto:justin.morissette.qc@gmail.com"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: '#fff',
                borderRadius: '5px',
                textDecoration: 'none',
                transition: 'background-color 0.3s',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#218838')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#28a745')}
            >
              Send Email
            </a>
            <p>justin.morissette.qc@gmail.com</p>
          </div>
        </div>
      </Html>
    </mesh>
  );
};

export default AboutMe;
