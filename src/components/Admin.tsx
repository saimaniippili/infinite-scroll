import React, { useState, useEffect } from 'react';
import type { PhotographData } from '../data';

const Admin: React.FC = () => {
  const [images, setImages] = useState<PhotographData[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);
  const [camera, setCamera] = useState('Vivo X300');
  const [loading, setLoading] = useState(false);

  const fetchImages = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/images');
      const data = await res.json();
      setImages(data);
    } catch (e) {
      console.error("Make sure the Express backend is running on port 3001!");
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) return;

    setLoading(true);
    const formData = new FormData();
    
    // Append all selected files
    Array.from(files).forEach((file) => {
      formData.append('images', file);
    });
    
    formData.append('camera', camera);

    try {
      await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData,
      });
      setFiles(null);
      // Reset the file input visually
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
    fetchImages();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    await fetch(`http://localhost:3001/api/images/${id}`, {
      method: 'DELETE',
    });
    fetchImages();
  };

  return (
    <div style={{ padding: '60px', fontFamily: 'Inter, sans-serif', color: '#111', background: '#fff', minHeight: '100vh', overflow: 'auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '10px' }}>Gallery Admin Panel</h1>
      <p style={{ color: '#666', marginBottom: '40px' }}>
        Total Images: {images.length} / Limit: 50 (Dynamic Scaling will activate at 50+)
      </p>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        {/* Upload Form */}
        <div style={{ flex: '1', minWidth: '300px', maxWidth: '400px', background: '#f9f9f9', padding: '30px', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Bulk Upload Artworks</h2>
          <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>1. Select Photos (You can select multiple)</label>
            <input id="file-upload" type="file" accept="image/*" multiple onChange={e => setFiles(e.target.files)} required style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', background: 'white' }} />
            
            <label style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '10px' }}>2. Camera Model</label>
            <input type="text" value={camera} onChange={e => setCamera(e.target.value)} required style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
            
            <button type="submit" disabled={loading} style={{ padding: '12px', background: '#111', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500, marginTop: '10px' }}>
              {loading ? 'Uploading...' : `Upload ${files ? files.length : 0} Images`}
            </button>
          </form>
        </div>

        {/* Gallery Grid */}
        <div style={{ flex: '2', minWidth: '300px' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Current Artworks</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {images.map(img => (
              <div key={img.id} style={{ border: '1px solid #eaeaea', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '240px', background: '#f4f4f4' }}>
                  <img src={img.url} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <h3 style={{ fontSize: '1rem', margin: 0 }}>{img.title}</h3>
                  <button onClick={() => handleDelete(img.id)} style={{ marginTop: '10px', padding: '8px', background: '#ffebee', color: '#d32f2f', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          {images.length === 0 && <p style={{ color: '#666' }}>No images in the database.</p>}
        </div>
      </div>
    </div>
  );
};

export default Admin;
