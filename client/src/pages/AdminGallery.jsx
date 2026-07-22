import React, { useState, useEffect } from 'react';
import AdminHeader from '../components/AdminHeader';
import { getGallery, createGalleryItem, deleteGalleryItem } from '../api/gallery';
import { compressImage } from '../utils/imageCompressor';

const SPORTS = ['Cricket', 'TT', 'Badminton', 'Chess', 'Carrom', 'BGMI'];

const AdminGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const handleImageError = (e, sportCategory) => {
    e.target.onerror = null;
    const fallbacks = {
      Cricket: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='100%' height='100%' fill='%2313131A'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23FF4D00' font-family='sans-serif' font-size='32' font-weight='bold'>🏏 Cricket Match</text></svg>",
      TT: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='100%' height='100%' fill='%2313131A'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2300E5FF' font-family='sans-serif' font-size='32' font-weight='bold'>🏓 Table Tennis Match</text></svg>",
      Badminton: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='100%' height='100%' fill='%2313131A'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23FFD700' font-family='sans-serif' font-size='32' font-weight='bold'>🏸 Badminton Match</text></svg>",
      Chess: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='100%' height='100%' fill='%2313131A'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23FF3366' font-family='sans-serif' font-size='32' font-weight='bold'>♟️ Chess Clash</text></svg>",
      Carrom: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='100%' height='100%' fill='%2313131A'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%231E90FF' font-family='sans-serif' font-size='32' font-weight='bold'>🟤 Carrom Showdown</text></svg>",
      BGMI: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='100%' height='100%' fill='%2313131A'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2300FF7F' font-family='sans-serif' font-size='32' font-weight='bold'>🎮 BGMI Arena</text></svg>"
    };
    e.target.src = fallbacks[sportCategory] || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='100%' height='100%' fill='%2313131A'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23888888' font-family='sans-serif' font-size='32' font-weight='bold'>🏆 Hostel Championship</text></svg>";
  };

  // Form State
  const [sport, setSport] = useState('Cricket');
  const [imageUrl, setImageUrl] = useState('');
  const [inputType, setInputType] = useState('file'); // 'file' | 'url'
  const [caption, setCaption] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setActionLoading(true);
    setErrorMsg('');
    try {
      // Compress image to max width/height 1200px, quality 0.75
      const compressedBase64 = await compressImage(file, { maxWidth: 1200, maxHeight: 900, quality: 0.75 });
      setImageUrl(compressedBase64);
    } catch (err) {
      console.error('Image compression failed:', err);
      setErrorMsg('Failed to process and compress image file.');
    } finally {
      setActionLoading(false);
    }
  };

  const fetchGalleryData = async () => {
    setLoading(true);
    try {
      const res = await getGallery();
      setPhotos(res.data || []);
    } catch (err) {
      console.error('Error fetching admin gallery listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryData();
  }, []);

  const openAddModal = () => {
    setSport('Cricket');
    setImageUrl('');
    setInputType('file');
    setCaption('');
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setActionLoading(true);

    if (!imageUrl || !caption || !sport) {
      setErrorMsg('Please complete all image parameters (URL, caption, sport).');
      setActionLoading(false);
      return;
    }

    try {
      await createGalleryItem({ sport, imageUrl, caption });
      setModalOpen(false);
      fetchGalleryData();
    } catch (err) {
      console.error('Error creating gallery item:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to save photo moment to gallery database.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePhoto = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this gallery item?')) return;

    try {
      await deleteGalleryItem(id);
      fetchGalleryData();
    } catch (err) {
      console.error('Error deleting photo:', err);
      alert('Delete operation failed.');
    }
  };

  return (
    <div className="min-h-screen bg-base pt-[100px] pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <span className="font-display font-bold uppercase tracking-widest text-accent text-sm">
              DATABASE CONSOLES
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-black uppercase text-text-bright tracking-wide mt-1">
              Manage <span className="bg-gradient-to-r from-accent to-accent-red bg-clip-text text-transparent">Match moments gallery</span>
            </h1>
          </div>
          <button
            onClick={openAddModal}
            className="bg-accent hover:bg-accent/90 text-base font-display uppercase font-bold text-xs tracking-wider px-5 py-2.5 rounded shadow-lg shadow-accent/20 transition-all duration-200"
          >
            <i className="fa-solid fa-plus mr-1.5"></i> Add Moment Photo
          </button>
        </div>

        <AdminHeader />

        {/* Loading / List Grid */}
        {loading ? (
          <div className="py-24 flex flex-col justify-center items-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-display uppercase tracking-widest text-accent text-sm">Loading Media Files...</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="bg-card border border-border/85 text-center py-20 rounded-md">
            <i className="fa-solid fa-image-portrait text-text-muted text-4xl mb-4"></i>
            <p className="font-display uppercase tracking-wider text-text-muted text-sm font-semibold">No media moment photographs registered</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <div
                key={photo._id}
                className="bg-card border border-border/80 rounded overflow-hidden shadow-lg relative group flex flex-col justify-between"
              >
                
                {/* Image */}
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption}
                    className="w-full h-full object-cover"
                    onError={(e) => handleImageError(e, photo.sport)}
                  />
                  <span className="absolute top-3 left-3 bg-black/60 border border-accent/20 text-accent font-display font-bold uppercase text-[9px] tracking-wider px-2 py-0.5 rounded">
                    {photo.sport}
                  </span>
                </div>

                {/* Caption Details and delete button */}
                <div className="p-4 flex justify-between items-start gap-4">
                  <div>
                    <p className="text-text-bright font-semibold text-xs leading-relaxed line-clamp-2 uppercase tracking-wide">
                      {photo.caption}
                    </p>
                    {photo.uploadedAt && (
                      <span className="text-[9px] text-text-muted mt-1 block">
                        Uploaded: {new Date(photo.uploadedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeletePhoto(photo._id)}
                    className="w-8 h-8 rounded bg-muted border border-border text-accent-red hover:bg-accent-red/10 hover:border-accent-red flex items-center justify-center transition-colors flex-shrink-0"
                    title="Delete Photo"
                  >
                    <i className="fa-solid fa-trash-can text-xs"></i>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Modal Overlay */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1500] p-4">
            <div className="bg-card border border-border/80 rounded w-full max-w-md shadow-2xl overflow-hidden glow-gold-left">
              
              {/* Header */}
              <div className="bg-[#0E0E12] border-b border-border/50 px-6 py-4 flex justify-between items-center">
                <h3 className="font-display font-black uppercase text-lg text-text-bright">
                  Upload Moment Photo
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-text-muted hover:text-text-bright transition-colors text-lg">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-4">
                
                {errorMsg && (
                  <div className="bg-accent-red/10 border border-accent-red/30 text-accent-red text-xs py-2 px-3 rounded flex items-center gap-2">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Sport */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Sport category</label>
                  <select
                    value={sport}
                    onChange={(e) => setSport(e.target.value)}
                    className="bg-muted border border-border text-text-bright rounded p-2.5 text-xs focus:outline-none focus:border-accent"
                  >
                    {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                 {/* Image Input (File Upload or URL) */}
                 <div className="flex flex-col gap-1.5">
                   <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Image Resource</label>
                   <div className="flex gap-2 mb-1 select-none">
                     <button
                       type="button"
                       onClick={() => { setInputType('file'); setImageUrl(''); setErrorMsg(''); }}
                       className={`flex-1 py-1.5 border rounded text-[10px] font-bold uppercase transition-all duration-200 ${
                         inputType === 'file' ? 'bg-accent border-accent text-base' : 'bg-muted border-border text-text-muted'
                       }`}
                     >
                       📁 Upload File
                     </button>
                     <button
                       type="button"
                       onClick={() => { setInputType('url'); setImageUrl(''); setErrorMsg(''); }}
                       className={`flex-1 py-1.5 border rounded text-[10px] font-bold uppercase transition-all duration-200 ${
                         inputType === 'url' ? 'bg-accent border-accent text-base' : 'bg-muted border-border text-text-muted'
                       }`}
                     >
                       🔗 Paste URL
                     </button>
                   </div>

                   {inputType === 'file' ? (
                     <div className="flex flex-col gap-1">
                       <input
                         type="file"
                         accept="image/*"
                         onChange={handleFileChange}
                         className="bg-muted border border-border text-text-bright rounded p-2 text-xs focus:outline-none focus:border-accent file:bg-card file:border-border file:text-text-bright file:rounded file:text-[10px] file:uppercase file:font-bold file:px-2 file:py-1 file:mr-2 file:cursor-pointer hover:file:bg-muted"
                       />
                       <span className="text-[9px] text-text-muted italic">Select a local image to upload (max 10MB).</span>
                     </div>
                   ) : (
                     <div className="flex flex-col gap-1">
                       <input
                         type="url"
                         value={imageUrl}
                         onChange={(e) => setImageUrl(e.target.value)}
                         placeholder="https://images.unsplash.com/photo-..."
                         className="bg-muted border border-border text-text-bright rounded p-2.5 text-xs focus:outline-none focus:border-accent"
                       />
                       <span className="text-[9px] text-text-muted italic">Provide a valid HTTP/HTTPS link to an image (e.g. Unsplash URL).</span>
                     </div>
                   )}

                   {imageUrl && (
                     <div className="mt-2 border border-border/50 rounded overflow-hidden aspect-video bg-muted relative">
                       <img 
                         src={imageUrl} 
                         alt="Upload Preview" 
                         className="w-full h-full object-cover" 
                         onError={(e) => handleImageError(e, sport)}
                       />
                       <button 
                         type="button"
                         onClick={() => setImageUrl('')}
                         className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 text-text-bright flex items-center justify-center hover:bg-black/90 text-[10px] transition-colors"
                         title="Clear Image"
                       >
                         ✕
                       </button>
                     </div>
                   )}
                 </div>

                {/* Caption */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Descriptive Caption</label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="e.g. Block A Raptors opening boundary strike"
                    rows="3"
                    className="bg-muted border border-border text-text-bright rounded p-2.5 text-xs focus:outline-none focus:border-accent resize-none"
                    required
                  ></textarea>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border/30">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider border border-border text-text-bright rounded hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-accent text-base rounded hover:bg-accent/90 transition-colors flex items-center gap-1.5"
                  >
                    {actionLoading && <span className="w-3.5 h-3.5 border-2 border-base border-t-transparent rounded-full animate-spin"></span>}
                    Upload Moment
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminGallery;
