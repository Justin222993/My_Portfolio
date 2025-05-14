import React, { useState, useEffect } from "react";
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import SceneViewer from "./Scene/SceneViewer";
import "./App.css";
import ProjectDetails from "./Scene/ProjectDetails";

function App() {
  const [language, setLanguage] = useState("English");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 968);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "English" ? "French" : "English"));
  };

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 968);
      };
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

  return (
    <Router>
      <div>
      {isMobile ? (
        <button
          onClick={toggleLanguage}
          style={{
            position: "absolute",
            bottom: "5px",
            right: "5px",
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
        {language === "English" ? "French" : "English"}
        </button>
      ) : (
        <button
        onClick={toggleLanguage}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {language === "English" ? "French" : "English"}
      </button>
      )}
        {/* Routes */}
        <Routes>
          <Route path="/" element={<SceneViewer language={language} />} />
          <Route path="/project/:id" element={<ProjectDetails language={language} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
