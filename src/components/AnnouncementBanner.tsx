import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Megaphone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

// Helper to extract YouTube video ID (supports Shorts prefixed with short-)
const getYoutubeId = (url: string) => {
  const shortsMatch = url.match(/(?:shorts\/)([^&?/\s]+)/);
  if (shortsMatch) {
    return `short-${shortsMatch[1]}`;
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export function AnnouncementBanner() {
  const { announcement } = useApp();
  const [isVisible, setIsVisible] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isVideoModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVideoModalOpen]);

  if (!announcement?.is_active || !isVisible) return null;

  const videoId = announcement.button_link ? getYoutubeId(announcement.button_link) : null;

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (videoId) {
      e.preventDefault();
      setIsVideoModalOpen(true);
    }
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
          className="w-full relative z-30 bg-gradient-to-r from-cyan/20 via-cyan/5 to-cyan/20 border-b border-cyan/30 backdrop-blur-md shadow-[0_0_15px_rgba(0,255,255,0.15)]"
        >
          <div className="container mx-auto px-4 py-2.5 flex flex-col sm:flex-row items-center justify-center gap-3 relative min-h-[44px]">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan"></span>
              </span>
              <p className="text-sm md:text-base font-bold tracking-widest uppercase text-white drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]">
                {announcement.title}
              </p>
            </div>

            {announcement.button_text && (
              <a
                href={announcement.button_link || '#'}
                onClick={handleCtaClick}
                target={!videoId ? "_blank" : undefined}
                rel={!videoId ? "noopener noreferrer" : undefined}
                className="flex items-center gap-2 px-4 py-1.5 bg-cyan text-black rounded font-black text-xs uppercase tracking-widest hover:bg-white transition-all skew-velocity hover:shadow-[0_0_10px_rgba(0,255,255,0.8)] cursor-pointer"
              >
                <Play className="w-3 h-3 unskew-velocity" fill="currentColor" />
                <span className="unskew-velocity">{announcement.button_text}</span>
              </a>
            )}

            <button
              onClick={() => setIsVisible(false)}
              className="absolute right-4 sm:right-6 p-1.5 text-gray-400 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full"
              aria-label="Close announcement"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoModalOpen && videoId && (() => {
          const isShort = videoId.startsWith('short-');
          const actualVideoId = isShort ? videoId.substring(6) : videoId;

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/90 backdrop-blur-sm"
              onClick={() => setIsVideoModalOpen(false)}
            >
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 hover:text-cyan rounded-full transition-colors text-white z-50"
                aria-label="Close video"
              >
                <X className="w-6 h-6" />
              </button>

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className={`relative w-full bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,255,255,0.15)] border border-white/10 ${
                  isShort ? 'aspect-[9/16] max-w-md max-h-[85vh]' : 'aspect-video max-w-5xl'
                }`}
                onClick={(e) => e.stopPropagation()} // Prevent clicks in modal from closing it
              >
                <iframe
                  src={`https://www.youtube.com/embed/${actualVideoId}?autoplay=1&rel=0`}
                  title="Announcement Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </>
  );
}
