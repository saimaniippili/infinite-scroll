import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Gallery from './components/Gallery';
import Overlay from './components/Overlay';
import CustomCursor from './components/CustomCursor';

function App() {
  const isMobile = window.innerWidth < 768;

  return (
    <>
      <CustomCursor />
      <Canvas
        style={{ touchAction: 'none' }}
        camera={{ position: [0, 0, 0], fov: isMobile ? 80 : 45 }}
        dpr={[1, 2]} // Support high-dpi displays but cap at 2 for perf
        gl={{ 
          antialias: true, // Re-enabling antialias since post-processing is removed
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace
        }}
      >
        <color attach="background" args={['#ffffff']} />
        <fog attach="fog" args={['#ffffff', 30, 80]} />
        
        <ambientLight intensity={1.8} />
        <directionalLight intensity={0.8} position={[10, 20, 10]} />
        
        <Suspense fallback={null}>
          <Gallery />
        </Suspense>
      </Canvas>
      <Overlay />
    </>
  );
}

export default App;
