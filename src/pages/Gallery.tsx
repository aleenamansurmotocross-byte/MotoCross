import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ExternalLink, X, ChevronLeft, ChevronRight, Play, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp, MediaFile } from '../context/AppContext';
import { useState, useEffect, useRef } from 'react';

const isVideoUrl = (url: string) => /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url);
const getMediaType = (item: MediaFile): 'image' | 'video' => {
  if (item.type) return item.type;
  return isVideoUrl(item.url) ? 'video' : 'image';
};

export function Gallery() {
  const { media } = useApp();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [lightboxMuted, setLightboxMuted] = useState(true);
  const lightboxVideoRef = useRef<HTMLVideoElement>(null);
  
  // Filter only fully uploaded pictures and exclude system tags like 'about-me'
  const activeMedia = media.filter(m => m.progress === 100 && m.tag !== 'about-me');

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % activeMedia.length);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + activeMedia.length) % activeMedia.length);
    }
  };

  // Close modal on escape key and handle arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, activeMedia.length]);

  // Reset muted state when lightbox closes
  useEffect(() => {
    if (selectedIndex === null) {
      setLightboxMuted(true);
    }
  }, [selectedIndex]);

  return (
    <div className="noise-bg min-h-screen bg-dark-bg text-white relative">
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-16">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-gray-400 hover:text-cyan transition-colors group text-sm font-bold uppercase tracking-widest"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Paddock
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-12 h-[2px] bg-cyan"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan">Official Media</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="display-text text-5xl md:text-7xl font-black italic uppercase mb-4 tracking-tighter">
            Velocity <span className="neon-cyan-text">Gallery</span>
          </h1>
          <p className="text-gray-400 max-w-xl text-lg font-light">High-resolution trackside captures, podium celebrations, and the raw energy of supercross.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeMedia.map((item, idx) => {
            const itemType = getMediaType(item);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedIndex(idx)}
                className={`glass-card overflow-hidden group cursor-pointer relative h-80 rounded-xl cursor-zoom-in ${item.featured ? 'border border-cyan glow-cyan' : ''}`}
              >
                {itemType === 'video' ? (
                  <>
                    <video 
                      src={item.url}
                      muted
                      playsInline
                      loop
                      preload="metadata"
                      className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                      onMouseEnter={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                      onMouseLeave={(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
                    />
                    {/* Play icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-70 group-hover:opacity-0 transition-opacity duration-300">
                      <div className="w-16 h-16 rounded-full bg-black/60 border-2 border-white/30 flex items-center justify-center backdrop-blur-sm">
                        <Play className="w-7 h-7 text-white fill-white ml-1" />
                      </div>
                    </div>
                  </>
                ) : (
                  <img 
                    src={item.url} 
                    alt={`Motocross action shot ${idx + 1}`} 
                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div className="flex justify-between items-center w-full">
                    <span className="font-mono text-xs uppercase tracking-widest font-bold text-white">{item.tag || 'View Full Res'}</span>
                    <ExternalLink className="w-5 h-5 text-cyan" />
                  </div>
                </div>
              </motion.div>
            );
          })}
          
          {activeMedia.length === 0 && (
             <div className="col-span-full py-20 text-center text-gray-500 font-mono text-sm">
               No media found in the gallery pit.
             </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && activeMedia[selectedIndex] && (() => {
          const selectedItem = activeMedia[selectedIndex];
          const selectedType = getMediaType(selectedItem);

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIndex(null)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-6 md:p-12 backdrop-blur-md cursor-zoom-out"
            >
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedIndex(null); }}
                className="absolute top-6 right-6 text-white hover:text-cyan transition-colors bg-charcoal/50 p-3 rounded-full border border-white/10 hover:border-cyan glow-cyan z-50"
              >
                <X className="w-6 h-6" />
              </button>

              {activeMedia.length > 1 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white hover:text-cyan transition-colors bg-charcoal/50 p-3 rounded-full border border-white/10 hover:border-cyan glow-cyan z-50"
                >
                  <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
              )}

              {selectedType === 'video' ? (
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
                    key={selectedItem.url}
                    src={selectedItem.url}
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
                  src={selectedItem.url}
                  alt="Fullscreen gallery view"
                  className="w-full max-w-[90vw] h-[80vh] object-contain drop-shadow-2xl rounded-sm"
                  referrerPolicy="no-referrer"
                  onClick={(e) => e.stopPropagation()}
                />
              )}

              {activeMedia.length > 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white hover:text-cyan transition-colors bg-charcoal/50 p-3 rounded-full border border-white/10 hover:border-cyan glow-cyan z-50"
                >
                  <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
              )}
              
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-400 font-mono text-sm tracking-widest bg-charcoal/80 px-4 py-2 rounded-full border border-white/10 flex flex-col items-center gap-1">
                <span>{selectedIndex + 1} / {activeMedia.length}</span>
                {selectedItem.tag && (
                  <span className="text-white text-xs">{selectedItem.tag}</span>
                )}
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
