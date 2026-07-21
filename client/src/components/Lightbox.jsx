import React, { useEffect } from 'react';

const Lightbox = ({ photo, onClose, onPrev, onNext }) => {
  if (!photo) return null;

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // lock scroll

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = ''; // unlock scroll
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div className="fixed inset-0 bg-[#060608]/95 flex items-center justify-center z-[2000] p-4 animate-fade-in">
      
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-text-bright hover:text-accent transition-all duration-200 p-2 text-2xl focus:outline-none"
        aria-label="Close Lightbox"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>

      {/* Prev Button */}
      <button
        onClick={onPrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/65 border border-border text-text-bright hover:bg-accent hover:text-base hover:border-accent flex items-center justify-center transition-all duration-200 z-10 focus:outline-none"
        aria-label="Previous Photo"
      >
        <i className="fa-solid fa-chevron-left text-lg"></i>
      </button>

      {/* Content wrapper */}
      <div className="max-w-4xl w-full flex flex-col items-center gap-4">
        <img
          src={photo.imageUrl}
          alt={photo.caption}
          className="max-h-[70vh] max-w-full rounded border border-border shadow-2xl object-contain bg-[#111]"
          onError={(e) => handleImageError(e, photo.sport)}
        />
        
        <div className="text-center mt-2 px-4">
          <span className="font-display font-bold uppercase tracking-widest text-accent text-sm block mb-1">
            {photo.sport}
          </span>
          <h3 className="font-display font-black text-xl md:text-2xl uppercase tracking-wider text-text-bright">
            {photo.caption}
          </h3>
          {photo.uploadedAt && (
            <span className="text-xs text-text-muted">
              Captured on {new Date(photo.uploadedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/65 border border-border text-text-bright hover:bg-accent hover:text-base hover:border-accent flex items-center justify-center transition-all duration-200 z-10 focus:outline-none"
        aria-label="Next Photo"
      >
        <i className="fa-solid fa-chevron-right text-lg"></i>
      </button>

    </div>
  );
};

export default Lightbox;
