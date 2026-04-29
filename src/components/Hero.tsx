import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Gradients to ensure text readability over the 3D background */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/80 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30, skewY: 5 }}
            animate={{ opacity: 1, y: 0, skewY: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            <h2 className="neon-orange-text font-bold tracking-widest uppercase text-sm mb-4 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-neon-orange"></span>
              Pro Supercross Racer
            </h2>
          </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              className="text-7xl md:text-9xl font-black italic uppercase leading-[0.85] tracking-tighter mb-6 display-text drop-shadow-2xl skew-velocity"
            >
              Fearless <br />
              <span className="neon-cyan-text">On Track</span>
            </motion.h1>

            <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className="text-gray-400 text-lg md:text-xl max-w-xl mb-10 font-light"
          >
            India's Rising Star in Supercross. Pushing limits, breaking records, and dominating the dirt with uncompromising velocity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="flex flex-wrap gap-4"
          >
            <a href="#gallery" className="btn-primary group">
              View Gallery
              <ChevronRight className="w-4 h-4" />
            </a>
            <a href="#events" className="btn-secondary group">
              Upcoming Events
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
