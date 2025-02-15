import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";


const ForestHouseModel = ({ modelPath, scale, position, rotation = [0, 0, 0], groupRef }) => {
  const { scene } = useGLTF(modelPath, true);
  const modelRef = useRef();

  return (
    <group ref={groupRef} scale={scale} position={position} rotation={rotation}>
      <primitive object={scene} ref={modelRef} />
    </group>
  );
};

// Preload the GLB file for better performance
useGLTF.preload("assets/forest_house.glb");

export default ForestHouseModel;
