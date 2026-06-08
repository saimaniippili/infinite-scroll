import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGalleryStore } from '../store';
import { X } from 'lucide-react';

const Overlay: React.FC = () => {
  const { activeImageId, setActiveImageId, hoveredImageId, photographs } = useGalleryStore();

  const activeData = activeImageId ? photographs.find((p) => p.id === activeImageId) : null;
  const hoveredData = hoveredImageId ? photographs.find((p) => p.id === hoveredImageId) : null;

  return (
    <>
      <div className="overlay-container">
        <div className="header">INFINITE CANVAS</div>
        <div className="instructions">Scroll to explore • Hover to discover</div>

        {/* Left Sidebar Preview Panel */}
        <div className="left-sidebar">
          <AnimatePresence mode="wait">
            {hoveredData && !activeData && (
              <motion.div
                key={hoveredData.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="sidebar-content"
              >
                <img src={hoveredData.url} alt={hoveredData.title} className="sidebar-image" />
                <div className="sidebar-title">{hoveredData.title}</div>
                <div className="sidebar-meta">{hoveredData.collection}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Active Fullscreen State */}
        <AnimatePresence>
          {activeData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fullscreen-bg"
            >
              <button
                className="close-btn"
                onClick={() => setActiveImageId(null)}
              >
                <X size={24} />
              </button>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="active-info"
              >
                <div className="active-title">{activeData.title}</div>
                <div className="meta-detail">{activeData.camera}</div>
                <div className="meta-detail" style={{ marginTop: '12px', color: 'var(--text-color)' }}>{activeData.collection}</div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .overlay-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 10;
          font-family: 'Inter', sans-serif;
        }
        .header {
          position: absolute;
          top: 40px;
          right: 40px; /* Moved to right to clear space for left sidebar */
          color: var(--text-color);
          font-weight: 500;
          letter-spacing: 1px;
          font-size: 14px;
          text-transform: uppercase;
        }
        .instructions {
          position: absolute;
          bottom: 40px;
          right: 40px;
          color: rgba(17, 17, 17, 0.5);
          font-size: 12px;
          letter-spacing: 0.5px;
          text-align: right;
        }
        
        /* Left Sidebar Styling */
        .left-sidebar {
          position: absolute;
          top: 40px;
          left: 40px;
          width: 140px;
          display: flex;
          flex-direction: column;
        }
        .sidebar-image {
          width: 100%;
          border-radius: 10px; /* Slightly smaller radius to match smaller image */
          object-fit: cover;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          margin-bottom: 12px; /* Tighter margin */
        }
        .sidebar-title {
          font-size: 14px; /* Reduced from 16px */
          font-weight: 500;
          color: var(--text-color);
          margin-bottom: 4px;
        }
        .sidebar-meta {
          font-size: 12px; /* Reduced from 13px */
          color: rgba(17, 17, 17, 0.5);
          font-weight: 400;
        }

        /* Fullscreen Styling */
        .fullscreen-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: transparent;
          pointer-events: none; /* Let clicks pass through if needed, except for buttons */
        }
        .fullscreen-bg * {
          pointer-events: auto;
        }
        .close-btn {
          position: absolute;
          top: 80px;
          right: 40px;
          color: var(--text-color);
          cursor: pointer;
          background: none;
          border: none;
          pointer-events: auto;
          z-index: 100;
          display: block;
        }
        .active-info {
          position: absolute;
          bottom: 40px;
          left: 40px;
          color: var(--text-color);
        }
        .active-title {
          font-size: 32px;
          font-weight: 400;
          margin-bottom: 12px;
        }
        .meta-detail {
          font-size: 12px;
          color: rgba(17, 17, 17, 0.6);
          margin-bottom: 4px;
          font-weight: 400;
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .header {
            top: 20px;
            left: 20px;
            right: auto;
          }
          .left-sidebar {
            display: none; /* Hide hover previews on touch devices */
          }
          .instructions {
            display: none; /* Simplify UI on small screens */
          }
          .close-btn {
            top: 20px;
            right: 20px;
          }
          .active-info {
            bottom: 60px; /* Increased to avoid being cut off by mobile browser UI */
            left: 0;
            width: 100%;
            text-align: center;
            padding-bottom: env(safe-area-inset-bottom, 20px);
          }
          .active-title {
            font-size: 24px;
          }
        }
      `}</style>
    </>
  );
};

export default Overlay;
