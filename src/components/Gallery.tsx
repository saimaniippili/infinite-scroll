import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Photograph from './Photograph';
import type { PhotographData } from '../data';
import { useGalleryStore } from '../store';

const Gallery: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const activeImageId = useGalleryStore((state) => state.activeImageId);
  const setCursorState = useGalleryStore((state) => state.setCursorState);

  const targetRotation = useRef(0);
  const currentCamAngle = useRef(0);
  const isDragging = useRef(false);
  const previousTouch = useRef<{ x: number, y: number } | null>(null);
  const mousePosition = useRef(new THREE.Vector2(0, 0));

  const photographs = useGalleryStore((state) => state.photographs);
  const setPhotographs = useGalleryStore((state) => state.setPhotographs);

  useEffect(() => {
    fetch('http://localhost:3001/api/images')
      .then(res => res.json())
      .then(data => setPhotographs(data))
      .catch(err => console.error("Failed to load images from backend:", err));
  }, []);

  const totalImages = photographs.length;
  // DYNAMIC RADIUS SCALING: Expands the circle math to prevent overlap when total images > 50
  const radius = Math.max(17.5, (totalImages * 2.5) / (Math.PI * 2));
  
  const items = useMemo(() => {
    return photographs.map((photo, index) => {
      const angle = (index / totalImages) * Math.PI * 2;
      
      const r = radius + (Math.random() - 0.5) * 1.0; 
      
      const x = Math.sin(angle) * r;
      const z = Math.cos(angle) * r;
      const y = (Math.random() - 0.5) * 0.5; 
      
      // Fixed rotation based strictly on orbit position. 
      // They are rigidly mounted to the circular path.
      const rotationY = angle;
      
      const scale = 0.85;

      return {
        ...photo,
        position: new THREE.Vector3(x, y, z),
        rotation: new THREE.Euler(0, rotationY, 0),
        scale: scale,
        baseAngle: angle,
        radius: r,
      };
    });
  }, [totalImages, radius]);

  useEffect(() => {
    // Wheel and drag now change the CAMERA orbit angle, not the group rotation.
    const handleWheel = (e: WheelEvent) => {
      if (useGalleryStore.getState().activeImageId) return; 
      targetRotation.current += e.deltaY * 0.001;
      targetRotation.current += e.deltaX * 0.001;
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (useGalleryStore.getState().activeImageId) return;
      isDragging.current = true;
      previousTouch.current = { x: e.clientX, y: e.clientY };
      document.body.style.cursor = 'none'; 
      setCursorState('grab');
    };

    const handlePointerMove = (e: PointerEvent) => {
      mousePosition.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePosition.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (!isDragging.current || !previousTouch.current) return;
      if (useGalleryStore.getState().activeImageId) return;

      const deltaX = e.clientX - previousTouch.current.x;
      
      if (e.pointerType === 'touch' || window.innerWidth < 768) {
        // Mobile touch logic: inverted (-=) for direct manipulation, slightly faster
        targetRotation.current -= deltaX * 0.005; 
      } else {
        // Original desktop mouse logic: exactly as it was originally
        targetRotation.current += deltaX * 0.003;
      }
      
      previousTouch.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      previousTouch.current = null;
      if (!useGalleryStore.getState().activeImageId) {
        setCursorState('default');
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [setCursorState]);

  useFrame((state, delta) => {
    if (activeImageId) {
      const activeItem = items.find(item => item.id === activeImageId);
      if (activeItem) {
        // Find shortest path to prevent helicopter spinning
        let target = activeItem.baseAngle;
        const current = targetRotation.current;
        let diff = (target - current) % (Math.PI * 2);
        if (diff > Math.PI) diff -= Math.PI * 2;
        if (diff < -Math.PI) diff += Math.PI * 2;
        
        targetRotation.current = current + diff;
        currentCamAngle.current = THREE.MathUtils.damp(currentCamAngle.current, targetRotation.current, 4, delta);

        const d = activeItem.radius + 9; // Zoomed in distance 
        
        state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, Math.sin(currentCamAngle.current) * d, 4, delta);
        state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, Math.cos(currentCamAngle.current) * d, 4, delta);
        state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, activeItem.position.y, 4, delta);
        
        state.camera.lookAt(0, activeItem.position.y, 0);
      }
    } else {
      if (!isDragging.current) {
        targetRotation.current += delta * 0.05; // auto orbit
      }

      currentCamAngle.current = THREE.MathUtils.damp(currentCamAngle.current, targetRotation.current, 4, delta);

      const d = radius + 14; // Orbit distance
      
      // Orbit the camera instead of rotating the exhibition
      const orbitX = Math.sin(currentCamAngle.current) * d;
      const orbitZ = Math.cos(currentCamAngle.current) * d;

      // Add subtle mouse parallax
      const parallaxX = mousePosition.current.x * 2;
      const parallaxY = mousePosition.current.y * 2;

      state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, orbitX + parallaxX, 4, delta);
      state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, orbitZ, 4, delta);
      state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, parallaxY + 2, 4, delta);

      state.camera.lookAt(0, parallaxY * 0.5, 0); 
    }
  });

  // The gallery group itself is completely static!
  return (
    <group ref={groupRef}>
      {items.map((item) => (
        <Photograph key={item.id} data={item} />
      ))}
    </group>
  );
};

export default Gallery;
