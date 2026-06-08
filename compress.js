import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const imagesDir = path.join(process.cwd(), 'public', 'images');
const dbPath = path.join(process.cwd(), 'server', 'db.json');
const dataTsPath = path.join(process.cwd(), 'src', 'data.ts');

async function processImages() {
  const files = fs.readdirSync(imagesDir).filter(f => f.match(/\.(png|jpe?g)$/i));
  
  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    const parsed = path.parse(file);
    const outFileName = parsed.name + '.webp';
    const outFilePath = path.join(imagesDir, outFileName);
    
    console.log(`Compressing ${file}...`);
    // Resize to max 1920px width (1080p web-friendly) to retain maximum visual clarity
    // and convert to WEBP with 90% quality for lossless-like appearance
    await sharp(filePath)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 90 })
      .toFile(outFilePath);
      
    // Delete the original massive file to save space
    fs.unlinkSync(filePath);
  }
  
  // Update db.json
  if (fs.existsSync(dbPath)) {
    const dbStr = fs.readFileSync(dbPath, 'utf8');
    const db = JSON.parse(dbStr);
    for (const photo of db.photographs) {
      if (photo.url) {
        photo.url = photo.url.replace(/\.(png|jpe?g)$/i, '.webp');
      }
    }
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    console.log('Updated db.json with .webp URLs');
  }

  // Update data.ts
  if (fs.existsSync(dataTsPath)) {
    let dataTsStr = fs.readFileSync(dataTsPath, 'utf8');
    dataTsStr = dataTsStr.replace(/\.(png|jpe?g)/gi, '.webp');
    fs.writeFileSync(dataTsPath, dataTsStr);
    console.log('Updated src/data.ts with .webp URLs');
  }
}

processImages().then(() => console.log('Compression complete!')).catch(console.error);
