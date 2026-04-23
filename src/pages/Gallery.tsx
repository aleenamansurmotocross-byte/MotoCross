import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export function Gallery() {
  const { media } = useApp();
  
  // Filter only fully uploaded pictures
  const activeMedia = media.filter(m => m.progress === 100);

  return (
    <div className="noise-bg min-h-screen bg-dark-bg text-white">
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
          {activeMedia.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`glass-card overflow-hidden group cursor-pointer relative h-80 rounded-xl ${item.featured ? 'border border-cyan glow-cyan' : ''}`}
            >
              <img 
                src={item.url} 
                alt={`Motocross action shot ${idx + 1}`} 
                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div className="flex justify-between items-center w-full">
                  <span className="font-mono text-xs uppercase tracking-widest font-bold text-white">{item.tag || 'View Full Res'}</span>
                  <ExternalLink className="w-5 h-5 text-cyan" />
                </div>
              </div>
            </motion.div>
          ))}
          
          {activeMedia.length === 0 && (
             <div className="col-span-full py-20 text-center text-gray-500 font-mono text-sm">
               No media found in the gallery pit.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
