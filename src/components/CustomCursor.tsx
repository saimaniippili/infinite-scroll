import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGalleryStore } from '../store';
import { X, ZoomIn, Grip } from 'lucide-react';

const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cursorState = useGalleryStore((state) => state.cursorState);
  const activeImageId = useGalleryStore((state) => state.activeImageId);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);

    // Hide native cursor
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.body.style.cursor = 'auto';
    };
  }, []);

  // Listen to escape key
  const setActiveImageId = useGalleryStore(state => state.setActiveImageId);
  const setCursorState = useGalleryStore(state => state.setCursorState);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeImageId) {
        setActiveImageId(null);
        setCursorState('default');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageId, setActiveImageId, setCursorState]);

  const variants = {
    default: {
      width: 12,
      height: 12,
      backgroundColor: 'rgba(255, 255, 255, 1)',
      border: '0px solid rgba(255, 255, 255, 0)',
      x: mousePosition.x - 6,
      y: mousePosition.y - 6,
      mixBlendMode: 'difference' as const
    },
    zoom: {
      width: 48,
      height: 48,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      mixBlendMode: 'normal' as const
    },
    close: {
      width: 48,
      height: 48,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      border: '1px solid rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(4px)',
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      mixBlendMode: 'normal' as const
    },
    grab: {
      width: 48,
      height: 48,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(0, 0, 0, 0.5)',
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      mixBlendMode: 'normal' as const
    }
  };

  return (
    <>
      <style>{`
        .custom-cursor {
          position: fixed;
          top: 0;
          left: 0;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        /* Fallback if JS fails */
        @media (pointer: coarse) {
          .custom-cursor {
            display: none;
          }
        }
      `}</style>
      <motion.div
        className="custom-cursor"
        variants={variants}
        animate={cursorState}
        transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
      >
        {cursorState === 'zoom' && <ZoomIn size={16} strokeWidth={1.5} />}
        {cursorState === 'close' && <X size={16} strokeWidth={1.5} />}
        {cursorState === 'grab' && <Grip size={16} strokeWidth={1.5} />}
      </motion.div>
    </>
  );
};

export default CustomCursor;
