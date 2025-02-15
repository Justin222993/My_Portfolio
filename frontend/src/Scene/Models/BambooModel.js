import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

const BambooModel = ({ modelPath, scale, position, groupRef, mouse }) => {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef();

  return (
    <group ref={groupRef} scale={scale} position={position}>
      <primitive object={scene} ref={modelRef} />
    </group>
  );
};

export default BambooModel;