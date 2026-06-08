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



const localImages = [
  "/images/photo_1.webp",
  "/images/photo_2.webp",
  "/images/photo_3.webp",
  "/images/photo_4.webp",
  "/images/photo_5.webp"
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
