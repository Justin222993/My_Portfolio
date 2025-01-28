import React, { useRef, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const GltfModel = ({ modelPath, scale, position, groupRef, mouse }) => {
  const model = useLoader(GLTFLoader, modelPath);
  const headRef = useRef(null);

  useEffect(() => {
    if (model && groupRef) {
      const headBone = model.scene.getObjectByName("Head");
      if (headBone) {
        headRef.current = headBone;
      }
    }
  }, [groupRef, model]);

  useEffect(() => {
    if (headRef.current) {
      headRef.current.rotation.y = (mouse.x * Math.PI) / 4;
      headRef.current.rotation.x = (-mouse.y * Math.PI) / 4;
    }
  }, [mouse]);

  return (
    <group ref={groupRef} position={position}>
      <primitive object={model.scene} scale={scale} />
    </group>
  );
};

export default GltfModel;
