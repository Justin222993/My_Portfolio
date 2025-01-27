import React, { useEffect, useState } from 'react';
import ModelViewer from './gltf/ModelViewer';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/test')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setMessage(data.message);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div>
        <h1>Backend Message</h1>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {!loading && !error && <p>{message}</p>}
      </div>
      <div>
        <ModelViewer 
          scale={1} 
          modelPath={"assets/CharactaurhRig.glb"} 
          position={[0, 0, 0]} 
        />
      </div>
    </div>
  );
}

export default App;
