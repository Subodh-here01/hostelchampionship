import React, { useState, useContext } from 'react';
import { useGallery } from '../hooks/useGallery';
import { AuthContext } from '../context/AuthContext';
import SportFilter from '../components/SportFilter';
import Lightbox from '../components/Lightbox';

const Gallery = () => {
  const [activeSport, setActiveSport] = useState('All');
  const { user } = useContext(AuthContext);

  const handleImageError = (e, sport) => {
    e.target.onerror = null;
    const fallbacks = {
      Cricket: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='100%' height='100%' fill='%2313131A'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23FF4D00' font-family='sans-serif' font-size='32' font-weight='bold'>🏏 Cricket Match</text></svg>",
      TT: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='100%' height='100%' fill='%2313131A'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2300E5FF' font-family='sans-serif' font-size='32' font-weight='bold'>🏓 Table Tennis Match</text></svg>",
      Badminton: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='100%' height='100%' fill='%2313131A'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23FFD700' font-family='sans-serif' font-size='32' font-weight='bold'>🏸 Badminton Match</text></svg>",
      Chess: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='100%' height='100%' fill='%2313131A'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23FF3366' font-family='sans-serif' font-size='32' font-weight='bold'>♟️ Chess Clash</text></svg>",
      Carrom: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='100%' height='100%' fill='%2313131A'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%231E90FF' font-family='sans-serif' font-size='32' font-weight='bold'>🟤 Carrom Showdown</text></svg>",
      BGMI: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='100%' height='100%' fill='%2313131A'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%2300FF7F' font-family='sans-serif' font-size='32' font-weight='bold'>🎮 BGMI Arena</text></svg>"
    };
    e.target.src = fallbacks[sport] || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'><rect width='100%' height='100%' fill='%2313131A'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23888888' font-family='sans-serif' font-size='32' font-weight='bold'>🏆 Hostel Championship</text></svg>";
  };

  const filters = {};
  if (activeSport !== 'All') {
    filters.sport = activeSport;
  }

  const { photos, loading, error } = useGallery(filters);
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);

  const openLightbox = (index) => {
    setActivePhotoIndex(index);
  };

  const closeLightbox = () => {
    setActivePhotoIndex(null);
  };

  const handlePrev = () => {
    if (photos.length === 0) return;
    setActivePhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (photos.length === 0) return;
    setActivePhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const currentPhoto = activePhotoIndex !== null ? photos[activePhotoIndex] : null;

  return (
    <div className="min-h-screen bg-base pt-[100px] pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10">
          <span className="font-display font-bold uppercase tracking-widest text-accent text-sm block mb-1">
            TOURNAMENT RECORDINGS
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black uppercase text-text-bright tracking-wide">
            MATCH <span className="bg-gradient-to-r from-accent to-accent-red bg-clip-text text-transparent">MOMENTS</span>
          </h1>
          <p className="text-text-muted text-sm mt-2 max-w-xl">
            Relive the greatest plays, emotional highlights, and victory moments captured across the arenas.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <SportFilter activeFilter={activeSport} onFilterChange={setActiveSport} />
        </div>

        {/* Image Grid */}
        {loading ? (
          <div className="py-24 flex flex-col justify-center items-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-display uppercase tracking-widest text-accent text-sm">Loading Media Files...</p>
          </div>
        ) : error ? (
          <div className="bg-accent-red/10 border border-accent-red/30 text-accent-red p-6 rounded-md flex items-center gap-4">
            <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
            <div>
              <h4 className="font-bold font-display uppercase tracking-wider text-sm">Gallery Media Error</h4>
              <p className="text-xs opacity-85 mt-1">{error}</p>
            </div>
          </div>
        ) : photos.length === 0 ? (
          <div className="bg-card border border-border/80 text-center py-20 rounded-md">
            <i className="fa-solid fa-image-portrait text-text-muted text-4xl mb-4"></i>
            <p className="font-display uppercase tracking-wider text-text-muted text-sm font-semibold">
              No tournament moments captured for {activeSport} yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo, index) => (
              <div
                key={photo._id}
                onClick={() => openLightbox(index)}
                className="group relative bg-card border border-border/80 rounded overflow-hidden aspect-video shadow-md hover:border-accent/40 cursor-zoom-in transition-all duration-300"
              >
                <img
                  src={photo.imageUrl}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 bg-[#15151b]"
                  loading="lazy"
                  onError={(e) => handleImageError(e, photo.sport)}
                />

                {/* Overlay details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                  <span className="font-display font-bold uppercase tracking-widest text-accent text-xs mb-1">
                    {photo.sport}
                  </span>
                  <p className="text-text-bright font-display uppercase font-bold text-sm tracking-wide line-clamp-2">
                    {photo.caption}
                  </p>
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-accent/25 border border-accent/40 flex items-center justify-center text-accent text-xs">
                    <i className="fa-solid fa-magnifying-glass-plus"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {currentPhoto && (
          <Lightbox
            photo={currentPhoto}
            onClose={closeLightbox}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}

      </div>
    </div>
  );
};

export default Gallery;
