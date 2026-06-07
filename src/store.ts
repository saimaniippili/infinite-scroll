import { create } from 'zustand';
import dbData from '../server/db.json';

export interface Photograph {
  id: string;
  url: string;
  title: string;
  cameraModel: string;
}

interface GalleryState {
  photographs: Photograph[];
  isLoading: boolean;
  activeImageId: string | null;
  hoveredImageId: string | null;
  cursorState: 'default' | 'grab' | 'dragging' | 'zoom' | 'close' | 'next' | 'prev';
  fetchPhotographs: () => Promise<void>;
  setActiveImageId: (id: string | null) => void;
  setHoveredImageId: (id: string | null) => void;
  setCursorState: (state: 'default' | 'grab' | 'dragging' | 'zoom' | 'close' | 'next' | 'prev') => void;
}

export const useGalleryStore = create<GalleryState>((set) => ({
  photographs: [],
  isLoading: false,
  activeImageId: null,
  hoveredImageId: null,
  cursorState: 'default',

  fetchPhotographs: async () => {
    set({ isLoading: true });
    try {
      if (import.meta.env.PROD) {
        // In Production (Netlify), use the bundled static JSON since there is no local Express server
        set({ photographs: dbData.photographs, isLoading: false });
      } else {
        // In Development, fetch from local Express server to get live updates immediately after upload
        const response = await fetch('http://localhost:3001/api/photographs');
        const data = await response.json();
        set({ photographs: data, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to fetch photographs:', error);
      set({ isLoading: false });
    }
  },

  setActiveImageId: (id) => set({ activeImageId: id }),
  setHoveredImageId: (id) => set({ hoveredImageId: id }),
  setCursorState: (state) => set({ cursorState: state }),
}));
