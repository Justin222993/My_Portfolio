import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import GltfModel from "./GltfModel";

const ModelViewer = ({ modelPath, scale = 40, position = [0, 0, 0] }) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      width: '100vw'
    }}>
      <div style={{ width: '1800px', height: '1200px' }}>
        <Canvas style={{ width: '100%', height: '100%' }}>
          <ambientLight intensity={0.3} />         
          <spotLight
            position={[-10, 3, 8]}
            angle={0.40}
            penumbra={1}
            intensity={600}
            castShadow={true}
          /> 
          <Suspense fallback={null}>
            <GltfModel modelPath={modelPath} scale={scale} position={position} />
            <OrbitControls />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default ModelViewer;
