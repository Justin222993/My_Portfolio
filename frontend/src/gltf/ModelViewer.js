import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import GltfModel from "./GltfModel";
import { Vector2, Vector3 } from "three";

const ModelViewer = ({ modelPath, scale = 40, position = [0, 0, 0] }) => {
  const [mouse, setMouse] = useState(new Vector2(0, 0));
  const groupRef = useRef(null);

  const onMouseMove = (event) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    setMouse(new Vector2(x, y));
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      }}
    >
      <Canvas style={{ width: "100%", height: "100%" }} camera={{ position: [0, 1, 3], rotation: [0, 0, 0] }}>

        {/* Using useThree hook inside the Canvas */}
        <CameraController mouse={mouse} groupRef={groupRef} />
        
        <ambientLight intensity={0.3} />
        <spotLight
          position={[-10, 3, 8]}
          angle={0.4}
          penumbra={1}
          intensity={1}
          castShadow
        />
        
        <Suspense fallback={null}>
          <GltfModel
            modelPath={modelPath}
            scale={scale}
            position={position}
            groupRef={groupRef}
            mouse={mouse}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

const CameraController = ({ mouse, groupRef }) => {
  const { camera } = useThree();

  useEffect(() => {
    if (groupRef.current && camera) {
      const vector = new Vector3(mouse.x, mouse.y, 0);
      vector.unproject(camera);

      groupRef.current.lookAt(vector);
    }
  }, [mouse, camera, groupRef]);

  return null;
};

export default ModelViewer;
