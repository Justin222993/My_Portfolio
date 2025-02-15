import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import CharacterModel from "./Models/CharacterModel";
import { Vector2 } from "three";
import ForestHouseModel from "./Models/ForestHouseModel";
import LayeredText from "./Texts/LayeredText";
import Comments from "./comments";
import Projects from "./projects";
import AboutMe from "./AboutMe";
import { Text , RoundedBox } from "@react-three/drei";
import * as THREE from "three";


const SceneViewer = ({ language }) => {
  const [user, setUser] = useState(null); // Move state here
  const ADMIN_GOOGLE_USER_ID = process.env.REACT_APP_ADMIN_GOOGLE_USER_ID;
  const isAdmin = user && user.sub === ADMIN_GOOGLE_USER_ID;

  const [mouse, setMouse] = useState(new Vector2(0, 0));
  const [rotation, setRotation] = useState(0);
  const groupRef = useRef(null);

  const colors = ["#f6eedc", "#c0e8d5", "#d1c4e9", "#ffccbc"];
  const [targetColor, setTargetColor] = useState(colors[0]);
  const [currentColor, setCurrentColor] = useState(colors[0]);

  // Handle hover effect
  const handleHover = (angle) => {
    setRotation((prev) => prev - angle);
  };

  // Handle unhover effect
  const handleUnhover = (angle) => {
    setRotation((prev) => prev + angle);
  };

  const handleClick = (angle, direction) => {
    setRotation((prev) => prev + angle);
    
    const currentIndex = colors.indexOf(targetColor);
    const nextIndex = direction === "right" 
      ? (currentIndex + 1) % colors.length 
      : (currentIndex - 1 + colors.length) % colors.length;
    setTargetColor(colors[nextIndex]);
  };
  // Color transition effect
  useEffect(() => {
    let animationFrameId;
    let startTime;
    const duration = 600; // Transition duration in milliseconds

    const startColor = currentColor;
    const endColor = targetColor;

    // Only animate if colors are different
    if (startColor === endColor) return;

    const updateColor = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const newColor = interpolateColor(startColor, endColor, progress);
      setCurrentColor(newColor);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateColor);
      }
    };

    animationFrameId = requestAnimationFrame(updateColor);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentColor, targetColor]);

  // Mouse movement handling
  const onMouseMove = (event) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    setMouse(new Vector2(x, y));
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = currentColor;
  }, [currentColor]);

  const SpeechBubble = ({ position, text }) => {
    return (
      <group position={position}>
        {/* Outline effect: A slightly scaled RoundedBox with black color */}
        <RoundedBox args={[2.23, 0.73, 0.5]} radius={0.2} smoothness={4} position={[0, 0.5, 0]}>
          <shaderMaterial
            attach="material"
            args={[
              {
                vertexShader: `
                  void main() {
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                  }
                `,
                fragmentShader: `
                  void main() {
                    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Black outline
                  }
                `,
                side: THREE.BackSide, // Ensure the outline is on the outside
              },
            ]}
          />
        </RoundedBox>
  
        {/* Speech bubble shape: RoundedBox with white color */}
        <RoundedBox args={[2.2, 0.7, 0.5]} radius={0.2} smoothness={4} position={[0, 0.5, 0]}>
          <meshStandardMaterial color="white" />
        </RoundedBox>
  
        {/* Position the text inside the bubble */}
      </group>
    );
  };
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ 
          position: [0, 1, 3], 
          rotation: [0, 0, 0],
          fov: 50,
        }}
        shadows
      >
          <ambientLight />
          <mesh position={[0, 1, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" />
          </mesh>
          <mesh position={[1, 0, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" />
          </mesh>
        <CameraController mouse={mouse} groupRef={groupRef} rotation={rotation} />
        <ambientLight intensity={0.5} />
        <spotLight position={[6, 6, 4]} angle={0.4} penumbra={1} intensity={500} />
        <Suspense fallback={null}>
          <CharacterModel
            modelPath={`${process.env.PUBLIC_URL}/assets/CharactaurhRig.glb`}
            scale={1}
            position={[0, 0, -2]}
            groupRef={groupRef}
            mouse={mouse}
          />

          <SpeechBubble position={[1.8, 0.4, -2]}/>

          <Text
        position={[1, 0.95, 0.26]}
        fontSize={0.08}
        color="black"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.2}
        lineHeight={1.2}
        textAlign="center"
      >
            {language === "French" ?
            "Vous pouvez cliquer sur les flèches pour naviguer entre les pages!" : 
            "You can click on the arrows to move through the pages!"}
      </Text>

          <ForestHouseModel
            modelPath={`${process.env.PUBLIC_URL}/assets/forest_house.glb`}
            scale={40}
            position={[-4.5, -0.5, -8]}
            rotation={[0, Math.PI / 1.4, 0]}
            groupRef={groupRef}
          />

          <LayeredText
            position={[6, 7, -13]}
            rotation={[0, 0, 0]}
            fontSize={1.5}
          >
            Justin Morissette
          </LayeredText>

          {/* About me */}

          <LayeredText
            position={[10, 5, 3]}
            rotation={[0, Math.PI / -2, 0]}
            fontSize={0.5}
          >
            {language === "French" ?
            "A propos de moi" : 
            "About me"}
          </LayeredText>

          <AboutMe 
            language={language}
          />

          {/* Projects */}

          <LayeredText
            position={[-10, 5, 3]}
            rotation={[0, Math.PI / 2, 0]}
            fontSize={0.5}
          >
            {language === "French" ?
            "Projets" : 
            "Projects"}
          </LayeredText>

          <Projects
            isAdmin={isAdmin}
            language={language}
          />

          {/* Comments */}

          <LayeredText
            position={[0, 5, 13]}
            rotation={[0, Math.PI, 0]}
            fontSize={0.5}
          >
            {language === "French" ?
            "Commentaires" : 
            "Comments"}
          </LayeredText>
          <Comments
            user={user}
            setUser={setUser}
            isAdmin={isAdmin}
            ADMIN_GOOGLE_USER_ID={ADMIN_GOOGLE_USER_ID}
            language={language}
          />
        </Suspense>
      </Canvas>

      {/* Left and Right Arrows */}
      <div
        style={arrowStyle.left}
        onMouseEnter={() => handleHover(-10)}
        onMouseLeave={() => handleUnhover(-10)}
        onClick={() => handleClick(90, "left")}
      >
        ◀
      </div>
      <div
        style={arrowStyle.right}
        onMouseEnter={() => handleHover(10)}
        onMouseLeave={() => handleUnhover(10)}
        onClick={() => handleClick(-90, "right")}
      >
        ▶
      </div>
    </div>
  );
};

const CameraController = ({ mouse, groupRef, rotation }) => {
  const { camera } = useThree();
  const targetRotation = useRef(rotation);

  // Update the target rotation when the rotation prop changes
  useEffect(() => {
    targetRotation.current = rotation;
  }, [rotation]);

  // Smoothly interpolate the camera's rotation towards the target rotation
  useFrame(() => {
    if (camera) {
      const currentYRotation = camera.rotation.y;
      const targetYRotation = targetRotation.current * (Math.PI / 180); // Convert to radians
      const lerpFactor = 0.1; // Adjust this value to control the smoothness

      // Lerp towards the desired rotation
      camera.rotation.y = currentYRotation + (targetYRotation - currentYRotation) * lerpFactor;
    }
  });

  return null;
};

// Function to interpolate between two colors
const interpolateColor = (start, end, factor) => {
  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };

  const rgbToHex = (r, g, b) =>
    `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;

  const startRGB = hexToRgb(start);
  const endRGB = hexToRgb(end);
  const resultRGB = startRGB.map((s, i) => Math.round(s + (endRGB[i] - s) * factor));

  return rgbToHex(resultRGB[0], resultRGB[1], resultRGB[2]);
}

const arrowStyle = {
  left: {
    position: "absolute",
    top: "50%",
    left: "10px",
    transform: "translateY(-50%)",
    fontSize: "2rem",
    cursor: "pointer",
    padding: "10px",
    background: "rgba(0, 0, 0, 0.5)",
    color: "white",
    borderRadius: "5px",
  },
  right: {
    position: "absolute",
    top: "50%",
    right: "10px",
    transform: "translateY(-50%)",
    fontSize: "2rem",
    cursor: "pointer",
    padding: "10px",
    background: "rgba(0, 0, 0, 0.5)",
    color: "white",
    borderRadius: "5px",
  },
};

export default SceneViewer;