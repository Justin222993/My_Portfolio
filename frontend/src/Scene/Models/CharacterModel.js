import React, { useRef, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from 'three';


const GltfModel = ({ modelPath, scale, position, groupRef, mouse }) => {
  const model = useLoader(GLTFLoader, modelPath);
  const headRef = useRef(null);

  useEffect(() => {
    if (model && groupRef) {
      model.scene.traverse((child) => {
        if (child.isMesh) {
          const excludedMaterials = ["Offwhite", "blackOutline"];

          if (Array.isArray(child.material)) {
            child.material.forEach((mat, index) => {
              if (excludedMaterials.includes(mat.name)) {
                // Force the material color to black and make it unaffected by light
                const newMaterial = mat.clone();
                newMaterial.color.set(0x000000);
                newMaterial.emissive.set(0x000000);
                newMaterial.emissiveIntensity = 1;
                child.material[index] = newMaterial;
              } else {
                child.material[index] = new THREE.MeshToonMaterial({
                  color: mat.color || 0xffffff,
                  gradientMap: null,
                });
              }
            });
          } else {
            if (excludedMaterials.includes(child.material.name)) {
              // Force the material color to black and make it unaffected by light
              const newMaterial = child.material.clone();
              newMaterial.color.set(0x000000);
              newMaterial.emissive.set(0x000000);
              newMaterial.emissiveIntensity = 1;
              child.material = newMaterial;
            } else {
              child.material = new THREE.MeshToonMaterial({
                color: child.material.color || 0xffffff,
                gradientMap: null,
              });
            }
          }
        }
      });

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
