import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if they clicked the hamburger button (which is outside the menuRef but inside the nav)
      // Since menuRef is just the slide-in panel, clicking the button triggers this if we aren't careful,
      // but clicking the button toggles state. Wait, the button is outside `menuRef`. If we click the toggle button, it fires outside click (setting isOpen to false) and then the button's onClick fires (setting it to true).
      // Actually, it's better to just check if the click is outside the entire nav or ignore it if they clicked the toggle button.
      // Easiest is to add a specific id or ref to the toggle button. Or just stop propagation on the toggle button.
    };

    const handleDocumentClick = (e: MouseEvent) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        // If they click the toggle button, let the toggle button handle it
        if ((e.target as Element).closest('#mobile-toggle-btn')) return;
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleDocumentClick);
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    } else {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-white/10"
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center relative z-50">
        <a href="#" className="flex items-center gap-2 group relative z-50">
          <span className="w-8 h-[2px] bg-neon-orange group-hover:w-12 transition-all duration-300"></span>
          <span className="font-black italic uppercase tracking-[0.15em] text-lg display-text">AleenaMansur</span>
        </a>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#gallery" className="text-sm font-bold uppercase tracking-widest hover:text-cyan transition-colors">
            Gallery
          </a>
          <a href="#events" className="text-sm font-bold uppercase tracking-widest hover:text-neon-orange transition-colors">
            Events
          </a>
          <a href="#contact" className="text-sm font-bold uppercase tracking-widest hover:text-[var(--theme-bg)] text-gray-400 transition-colors">
            Contact
          </a>
          <button 
            onClick={toggleTheme} 
            className="ml-4 p-2 rounded-full border border-white/10 hover:border-cyan hover:text-cyan transition-colors bg-white/5"
            title="Toggle Light/Dark Mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full border border-white/10 hover:border-cyan hover:text-cyan transition-colors bg-white/5"
            title="Toggle Light/Dark Mode"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button 
            id="mobile-toggle-btn"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-[var(--theme-text)] hover:text-cyan transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-in Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            
            {/* Slide-in Panel */}
            <motion.div
              ref={menuRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-64 bg-[var(--theme-surface)] border-l border-white/5 z-50 shadow-2xl flex flex-col md:hidden pt-24"
            >
              <div className="flex flex-col gap-6 px-8">
                <a 
                  href="#gallery" 
                  onClick={closeMenu}
                  className="text-lg font-bold uppercase tracking-widest hover:text-cyan transition-colors border-b border-white/5 pb-4"
                >
                  Gallery
                </a>
                <a 
                  href="#events" 
                  onClick={closeMenu}
                  className="text-lg font-bold uppercase tracking-widest hover:text-neon-orange transition-colors border-b border-white/5 pb-4"
                >
                  Events
                </a>
                <a 
                  href="#contact" 
                  onClick={closeMenu}
                  className="text-lg font-bold uppercase tracking-widest hover:text-cyan text-gray-400 transition-colors border-b border-white/5 pb-4"
                >
                  Contact
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
