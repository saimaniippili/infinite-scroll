import { create } from 'zustand';
import type { PhotographData } from './data';

interface GalleryState {
  photographs: PhotographData[];
  setPhotographs: (photos: PhotographData[]) => void;
  activeImageId: string | null;
  hoveredImageId: string | null;
  cursorState: 'default' | 'grab' | 'dragging' | 'zoom' | 'close' | 'next' | 'prev';
  setActiveImageId: (id: string | null) => void;
  setHoveredImageId: (id: string | null) => void;
  setCursorState: (state: 'default' | 'grab' | 'dragging' | 'zoom' | 'close' | 'next' | 'prev') => void;
}

export const useGalleryStore = create<GalleryState>((set) => ({
  photographs: [],
  setPhotographs: (photos) => set({ photographs: photos }),
  activeImageId: null,
  hoveredImageId: null,
  cursorState: 'default',
  setActiveImageId: (id) => set({ activeImageId: id }),
  setHoveredImageId: (id) => set({ hoveredImageId: id }),
  setCursorState: (state) => set({ cursorState: state }),
}));
