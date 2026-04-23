import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="w-full h-full"
        >
          <img
            src="/images/hero_bg.jpg"
            alt="Husqvarna TC85 Motocross"
            className="w-full h-full object-cover object-center grayscale opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/80 to-transparent" />
        </motion.div>
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
              Aleena Mansur
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
            <Link to="/gallery" className="bg-cyan hover:bg-white transition-all duration-300 text-black font-bold py-4 px-8 uppercase text-sm tracking-wider flex items-center gap-2 group skew-velocity glow-cyan">
              <span className="unskew-velocity">View Gallery</span>
              <ChevronRight className="w-4 h-4 unskew-velocity group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#events" className="glass-card hover:bg-white/10 transition-all duration-300 py-4 px-8 uppercase text-sm tracking-wider font-semibold group skew-velocity border border-cyan text-cyan block flex justify-center items-center">
              <span className="unskew-velocity block">Upcoming Events</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
