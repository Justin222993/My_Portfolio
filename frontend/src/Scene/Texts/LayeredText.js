import React, { useRef, useState } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const lerp = (start, end, t) => start * (1 - t) + end * t;

const LayeredText = ({ 
  children, 
  position,
  rotation,
  fontSize = 1,
  anchorX = "center",
  anchorY = "middle"
}) => {
  const groupRef = useRef();
  const redTextRef = useRef();
  const blueTextRef = useRef();
  const [hovered, setHovered] = useState(false);
  const targetOffset = hovered ? 0.02 : 0;

  useFrame((_, delta) => {
    if (redTextRef.current && blueTextRef.current) {
      redTextRef.current.position.x = lerp(redTextRef.current.position.x, -targetOffset, delta * 5);
      redTextRef.current.position.y = lerp(redTextRef.current.position.y, targetOffset, delta * 5);
      blueTextRef.current.position.x = lerp(blueTextRef.current.position.x, targetOffset, delta * 5);
      blueTextRef.current.position.y = lerp(blueTextRef.current.position.y, -targetOffset, delta * 5);
    }
  });

  return (
    <group 
      ref={groupRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Base layer (blue) */}
      <Text
        ref={blueTextRef}
        font={`${process.env.PUBLIC_URL}/fonts/Fredoka-Bold.ttf`}
        fontSize={fontSize}
        anchorX={anchorX}
        anchorY={anchorY}
        color="blue" // Low alpha blue
        fillOpacity={0.6}
        transparent
        position={[0, 0, 0]}
      >
        {children}
      </Text>
      
      {/* Top layer (red) */}
      <Text
        ref={redTextRef}
        font={`${process.env.PUBLIC_URL}/fonts/Fredoka-Bold.ttf`}
        fontSize={fontSize}
        anchorX={anchorX}
        anchorY={anchorY}
        color="red" // Low alpha red
        fillOpacity={0.6}
        transparent
        position={[0, 0, 0.001]}
      >
        {children}
      </Text>
    </group>
  );
};

export default LayeredText;
