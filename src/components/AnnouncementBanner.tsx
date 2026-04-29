import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Megaphone } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

export function AnnouncementBanner() {
  const { announcement } = useApp();
  const [isVisible, setIsVisible] = useState(true);

  if (!announcement?.is_active || !isVisible) return null;

  return (
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
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-1.5 bg-cyan text-black rounded font-black text-xs uppercase tracking-widest hover:bg-white transition-all skew-velocity hover:shadow-[0_0_10px_rgba(0,255,255,0.8)]"
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
  );
}
