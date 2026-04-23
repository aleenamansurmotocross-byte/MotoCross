import { motion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-white/10"
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#" className="flex items-center gap-2 group">
          <span className="w-8 h-[2px] bg-neon-orange group-hover:w-12 transition-all duration-300"></span>
          <span className="font-black italic uppercase tracking-widest text-lg display-text">Velocity</span>
        </a>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#gallery" className="text-sm font-bold uppercase tracking-widest hover:text-cyan transition-colors">
            Gallery
          </a>
          <a href="#events" className="text-sm font-bold uppercase tracking-widest hover:text-neon-orange transition-colors">
            Events
          </a>
          <a href="#contact" className="text-sm font-bold uppercase tracking-widest hover:text-white text-gray-400 transition-colors">
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
      </div>
    </motion.nav>
  );
}
