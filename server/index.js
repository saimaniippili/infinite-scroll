import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Path to our JSON database and uploads folder
const dbPath = path.join(__dirname, 'db.json');
const uploadDir = path.join(__dirname, '../public/images');

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Helper to read DB
const readDB = () => {
  if (!fs.existsSync(dbPath)) return { photographs: [] };
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
};

// Helper to write DB
const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// GET all images
app.get('/api/images', (req, res) => {
  const db = readDB();
  res.json(db.photographs);
});

// POST multiple images
app.post('/api/upload', (req, res, next) => {
  upload.array('images', 100)(req, res, (err) => {
    if (err) {
      console.error("Multer Error:", err);
      return res.status(400).json({ error: err.message, field: err.field });
    }
    next();
  });
}, (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No images uploaded' });
  }

  const db = readDB();
  const currentCount = db.photographs.length;
  
  const newPhotos = req.files.map((file, index) => {
    return {
      id: `photo-${Date.now()}-${index}`,
      url: `/images/${file.filename}`, // Relative path for frontend
      title: `Photograph ${currentCount + index + 1}`,
      camera: req.body.camera || 'Vivo X300',
      aspectRatio: 0.666 // Default to portrait
    };
  });

  db.photographs.push(...newPhotos);
  writeDB(db);

  res.status(201).json(newPhotos);
});

// DELETE image
app.delete('/api/images/:id', (req, res) => {
  const db = readDB();
  const index = db.photographs.findIndex(p => p.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Image not found' });
  }

  const photo = db.photographs[index];
  
  // Remove file from disk
  const filePath = path.join(__dirname, '..', 'public', photo.url);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Remove from JSON
  db.photographs.splice(index, 1);
  writeDB(db);

  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
