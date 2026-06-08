import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Image } from '@react-three/drei';
import * as THREE from 'three';
import { useGalleryStore } from '../store';
import type { PhotographData } from '../data';

interface PhotographProps {
  data: PhotographData & {
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: number;
    baseAngle: number;
    radius: number;
  };
}

const Photograph: React.FC<PhotographProps> = ({ data }) => {
  const meshRef = useRef<THREE.Group>(null);
  const materialRef = useRef<any>(null);
  
  const [hovered, setHovered] = useState(false);
  
  const { activeImageId, setActiveImageId, setHoveredImageId, setCursorState } = useGalleryStore();
  
  const isActive = activeImageId === data.id;
  const isAnyActive = activeImageId !== null;

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    
    let targetScale = data.scale;
    let targetX = data.position.x;
    let targetZ = data.position.z;
    let targetY = data.position.y;

    if (isActive) {
      targetScale = data.scale * 1.5; 
      // Pop OUTWARD from the ring toward the camera
      targetX = Math.sin(data.baseAngle) * (data.radius + 2); 
      targetZ = Math.cos(data.baseAngle) * (data.radius + 2);
    } else if (hovered && !isAnyActive) {
      targetScale = data.scale * 1.1; 
      targetY = data.position.y + 0.3; 
      targetX = Math.sin(data.baseAngle) * (data.radius + 1);
      targetZ = Math.cos(data.baseAngle) * (data.radius + 1);
    }

    meshRef.current.position.x = THREE.MathUtils.damp(meshRef.current.position.x, targetX, 6, delta);
    meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetY, 6, delta);
    meshRef.current.position.z = THREE.MathUtils.damp(meshRef.current.position.z, targetZ, 6, delta);
    meshRef.current.scale.setScalar(THREE.MathUtils.damp(meshRef.current.scale.x, targetScale, 6, delta));

    // Fade out other images when one is active
    if (materialRef.current) {
      const targetOpacity = isAnyActive ? (isActive ? 1 : 0.1) : 1;
      materialRef.current.opacity = THREE.MathUtils.damp(materialRef.current.opacity, targetOpacity, 6, delta);
    }
  });

  // Fixed uniform portrait card shape (2:3 aspect ratio)
  const width = 2.4;
  const height = 3.6;

  return (
    <group
      ref={meshRef}
      position={data.position}
      rotation={data.rotation}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (!isAnyActive) {
          setHovered(true);
          setHoveredImageId(data.id);
          setCursorState('zoom');
        }
      }}
      onPointerOut={() => {
        setHovered(false);
        setHoveredImageId(null);
        setCursorState('default');
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (!isAnyActive) {
          setActiveImageId(data.id);
          setCursorState('close');
        } else if (isActive) {
          setActiveImageId(null);
          setCursorState('default');
        }
      }}
    >
      <Image
        url={data.url}
        transparent
        // @ts-ignore
        material-ref={materialRef}
        scale={[width, height]}
        side={THREE.DoubleSide}
      />
    </group>
  );
};

export default Photograph;
