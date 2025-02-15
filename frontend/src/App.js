import React, { useState } from "react";
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import SceneViewer from "./Scene/SceneViewer";
import "./App.css";
import ProjectDetails from "./Scene/ProjectDetails";

function App() {
  const [language, setLanguage] = useState("English");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "English" ? "French" : "English"));
  };

  return (
    <Router>
      <div>
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
          {language}
        </button>

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
