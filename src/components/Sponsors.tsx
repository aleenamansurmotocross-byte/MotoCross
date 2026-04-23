import { motion } from 'motion/react';

const SPONSORS = [
  'ALIGNED AUTOMATION',
  'HUSQVARNA',
  'MOTUL',
  'FOX RACING',
  'RED BULL',
  'DUNLOP',
  'ALPINESTARS',
];

export function Sponsors() {
  // Duplicate array slightly for a seamless scroll
  const duplicatedSponsors = [...SPONSORS, ...SPONSORS, ...SPONSORS];

  return (
    <section className="py-20 relative z-20 border-y border-white/5 bg-charcoal/80 overflow-hidden">
      <div className="container mx-auto px-6 mb-8">
        <h3 className="text-center text-sm font-bold uppercase tracking-[0.2em] text-gray-400">
          Powered By Industry Leaders
        </h3>
      </div>
      
      <div className="relative flex whitespace-nowrap">
        {/* Gradients for mask effect */}
        <div className="absolute top-0 left-0 w-32 h-full z-10 bg-gradient-to-r from-charcoal to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-full z-10 bg-gradient-to-l from-charcoal to-transparent pointer-events-none" />
        
        <motion.div
          className="flex whitespace-nowrap items-center"
          animate={{ x: ['0%', '-33.33%'] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 20
          }}
        >
          {duplicatedSponsors.map((sponsor, i) => (
            <div 
              key={i} 
              className="px-12 flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity duration-300"
            >
              <span className="text-3xl md:text-5xl font-black uppercase text-transparent bg-clip-text"
                    style={{ WebkitTextStroke: '1px rgba(255,255,255,0.6)' }}
              >
                {sponsor}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
