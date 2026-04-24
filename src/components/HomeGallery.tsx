import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Image as ImageIcon, X, ChevronLeft, ChevronRight, Play, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useState, useEffect, useRef } from 'react';

const isVideoUrl = (url: string) => /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url);
const getMediaType = (item: any): 'image' | 'video' => {
  if (item.type) return item.type;
  return isVideoUrl(item.url || item) ? 'video' : 'image';
};

export function HomeGallery() {
  const { media } = useApp();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [lightboxMuted, setLightboxMuted] = useState(true);
  const lightboxVideoRef = useRef<HTMLVideoElement>(null);
  
  // Get up to 5 actual uploaded images, excluding specific system tags like 'about-me'
  const activeMedia = media.filter(m => m.progress === 100 && m.tag !== 'about-me');
  
  // Fallback images to ensure we always have exactly 5 for the grid
  const fallbacks = [
    '/images/gallery_1.jpg',
    '/images/gallery_2.jpg',
    '/images/gallery_3.jpg',
    '/images/gallery_4.jpg',
    '/images/event_3.jpg'
  ];

  // Create an array of exactly 5 media objects
  const displayMedia = Array.from({ length: 5 }).map((_, i) => {
    return activeMedia[i] || { url: fallbacks[i % fallbacks.length], type: 'image' };
  });

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % displayMedia.length);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + displayMedia.length) % displayMedia.length);
    }
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, displayMedia.length]);

  // Reset muted state when lightbox closes
  useEffect(() => {
    if (selectedIndex === null) {
      setLightboxMuted(true);
    }
  }, [selectedIndex]);

  return (
    <section id="gallery" className={`py-24 relative bg-dark-bg border-t border-white/5 ${selectedIndex !== null ? 'z-[100]' : 'z-20'}`}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black italic uppercase display-text">
              Trackside <span className="neon-cyan-text">Gallery</span>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:block"
          >
            <Link 
              to="/gallery" 
              className="text-sm font-bold uppercase tracking-wider text-cyan hover:text-white transition-colors flex items-center gap-2"
            >
              View Full Gallery <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* The Grid: exactly 5 items. Stacks on mobile, 5-cols on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {displayMedia.map((item, i) => {
            const itemType = getMediaType(item);
            const src = typeof item === 'string' ? item : item.url;

            return (
              <motion.div
                key={`home-gal-${i}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => setSelectedIndex(i)}
                className="relative h-64 md:h-80 overflow-hidden group rounded-xl border border-white/5 glass-card cursor-zoom-in"
              >
                {itemType === 'video' ? (
                  <video 
                    src={src}
                    muted
                    playsInline
                    loop
                    className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                    onMouseEnter={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                    onMouseLeave={(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
                  />
                ) : (
                  <img 
                    src={src} 
                    alt={`Gallery snapshot ${i + 1}`}
                    className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="absolute inset-0 bg-cyan/0 group-hover:bg-cyan/10 transition-colors duration-300 z-10 mix-blend-overlay" />
                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {itemType === 'video' ? (
                    <Play className="w-5 h-5 text-white drop-shadow-md" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-white drop-shadow-md" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile View All button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex justify-center md:hidden"
        >
          <Link 
            to="/gallery" 
            className="btn-primary group"
          >
            View Full Gallery <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (() => {
          const item = displayMedia[selectedIndex];
          const itemType = getMediaType(item);
          const src = typeof item === 'string' ? item : item.url;

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIndex(null)}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-6 md:p-12 backdrop-blur-md cursor-zoom-out"
            >
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedIndex(null); }}
                className="absolute top-6 right-6 text-white hover:text-cyan transition-colors bg-charcoal/50 p-3 rounded-full border border-white/10 hover:border-cyan glow-cyan z-[110]"
              >
                <X className="w-6 h-6" />
              </button>
              
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white hover:text-cyan transition-colors bg-charcoal/50 p-3 rounded-full border border-white/10 hover:border-cyan glow-cyan z-[110]"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>

              {itemType === 'video' ? (
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0, scale: 0.95, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: -20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="relative w-full max-w-[90vw] h-[80vh] flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <video
                    ref={lightboxVideoRef}
                    key={src}
                    src={src}
                    autoPlay
                    loop
                    muted={lightboxMuted}
                    playsInline
                    controls
                    className="w-full h-full object-contain rounded-sm drop-shadow-2xl"
                  />
                  {/* Mute/unmute toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxMuted(!lightboxMuted);
                    }}
                    className="absolute top-4 right-4 text-white hover:text-cyan bg-black/60 backdrop-blur-sm p-2.5 rounded-full border border-white/20 hover:border-cyan transition-all z-10"
                  >
                    {lightboxMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                </motion.div>
              ) : (
                <motion.img
                  key={selectedIndex}
                  initial={{ opacity: 0, scale: 0.95, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: -20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  src={src}
                  alt="Fullscreen gallery view"
                  className="w-full max-w-[90vw] h-[80vh] object-contain drop-shadow-2xl rounded-sm"
                  referrerPolicy="no-referrer"
                  onClick={(e) => e.stopPropagation()}
                />
              )}

              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white hover:text-cyan transition-colors bg-charcoal/50 p-3 rounded-full border border-white/10 hover:border-cyan glow-cyan z-[110]"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
              
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-400 font-mono text-sm tracking-widest bg-charcoal/80 px-4 py-2 rounded-full border border-white/10 z-[110]">
                {selectedIndex + 1} / {displayMedia.length}
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </section>
  );
}
