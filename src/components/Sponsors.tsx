import { motion } from 'motion/react';

// List of sponsors to be displayed in the marquee
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
  // Duplicate array slightly for a seamless infinite scroll effect
  const duplicatedSponsors = [...SPONSORS, ...SPONSORS, ...SPONSORS];

  return (
    <section className="py-20 relative z-20 border-y border-white/5 bg-charcoal/80 overflow-hidden">
      <div className="container mx-auto px-6 mb-12">
        <h2 className="text-center text-3xl md:text-4xl font-black italic uppercase display-text">
          <span className="text-gray-500">Sponsored</span> <span className="text-white">By</span>
        </h2>
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
              className="px-16 flex items-center justify-center opacity-40 hover:opacity-100 transition-all duration-500 cursor-pointer group"
            >
              <span className="text-4xl md:text-6xl font-black italic display-text uppercase text-transparent bg-clip-text group-hover:neon-cyan-text group-hover:text-cyan transition-all duration-500"
                    style={{ WebkitTextStroke: '2px var(--theme-text-stroke)', WebkitTextFillColor: 'transparent' }}
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
