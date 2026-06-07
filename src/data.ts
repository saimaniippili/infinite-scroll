export interface PhotographData {
  id: string;
  url: string;
  title: string;
  location?: string;
  year?: string;
  camera: string;
  lens?: string;
  collection?: string;
  aspectRatio: number;
}

const fallbackImages = [
  "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop", // Photography camera
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1964&auto=format&fit=crop", // Camera lens
  "https://images.unsplash.com/photo-1533167649158-6d508895b680?q=80&w=1932&auto=format&fit=crop", // City
  "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1854&auto=format&fit=crop", // Portrait
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop", // Nature
  "https://images.unsplash.com/photo-1447958272669-9c562446304f?q=80&w=2000&auto=format&fit=crop", // Mountain
  "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1973&auto=format&fit=crop", // Ice
  "https://images.unsplash.com/photo-1506744626753-143d4cba7993?q=80&w=2000&auto=format&fit=crop", // Landscape
  "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?q=80&w=2070&auto=format&fit=crop", // Desert
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop", // Woman portrait
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1887&auto=format&fit=crop", // Fashion portrait
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop", // Another portrait
];

const localImages = [
  "/images/photo_1.png",
  "/images/photo_2.png",
  "/images/photo_3.png",
  "/images/photo_4.png",
  "/images/photo_5.png"
];

// Generate 40 images looping over our 5 samples
export const photographs: PhotographData[] = Array.from({ length: 40 }).map((_, i) => {
  const isPortrait = Math.random() > 0.5;
  const ratio = isPortrait ? (2/3) + (Math.random() * 0.2) : (3/2) + (Math.random() * 0.2);
  return {
    id: `photo-${i}`,
    url: localImages[i % localImages.length],
    title: `Artwork ${i + 1}`,
    location: ["Paris, France", "Tokyo, Japan", "New York, USA", "Iceland", "Swiss Alps"][Math.floor(Math.random() * 5)],
    year: `202${Math.floor(Math.random() * 4)}`,
    camera: ["Leica M11", "Sony A7RV", "Fujifilm GFX 100S", "Hasselblad X2D"][Math.floor(Math.random() * 4)],
    lens: ["35mm f/1.4", "50mm f/1.2", "85mm f/1.4", "24-70mm f/2.8"][Math.floor(Math.random() * 4)],
    collection: ["Exhibition I", "Archive", "Selected Works"][Math.floor(Math.random() * 3)],
    aspectRatio: ratio,
  };
});
