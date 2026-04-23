import { motion } from 'motion/react';

// List of sponsors to be displayed in the marquee
const SPONSORS = [
  { name: 'ALIGNED AUTOMATION', logo: '/images/sponsors/aligned.png' },
  { name: 'SCHOOL OF INDIA', logo: '/images/sponsors/school.png' },
  { name: 'MFAR DEVELOPERS', logo: '/images/sponsors/mfar.png' }
];

export function Sponsors() {
  // Duplicate array slightly for a seamless infinite scroll effect
  // Increased duplication since there are fewer sponsors now
  const duplicatedSponsors = [...SPONSORS, ...SPONSORS, ...SPONSORS, ...SPONSORS, ...SPONSORS];

  return (
    <section className="py-20 relative z-20 border-y border-white/5 bg-charcoal/80 overflow-hidden">
      <div className="container mx-auto px-6 mb-12">
        <h2 className="text-center text-3xl md:text-4xl font-black italic uppercase display-text">
          <span className="text-gray-500">Sponsored</span> <span className="text-white">By</span>
        </h2>
      </div>
      
      <div className="relative flex whitespace-nowrap py-4">
        {/* Gradients for mask effect */}
        <div className="absolute top-0 left-0 w-32 h-full z-10 bg-gradient-to-r from-charcoal to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-full z-10 bg-gradient-to-l from-charcoal to-transparent pointer-events-none" />
        
        <motion.div
          className="flex whitespace-nowrap items-center"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 30
          }}
        >
          {duplicatedSponsors.map((sponsor, i) => (
            <div 
              key={i} 
              className="px-12 md:px-20 flex items-center justify-center opacity-60 hover:opacity-100 transition-all duration-500 cursor-pointer group"
            >
              {/* Fallback text rendering if images aren't present */}
              <img 
                src={sponsor.logo} 
                alt={sponsor.name} 
                className="h-16 md:h-24 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                onError={(e) => {
                  // If image fails to load, hide it and show text span
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <span className="hidden text-4xl md:text-6xl font-black italic display-text uppercase text-transparent bg-clip-text group-hover:neon-cyan-text group-hover:text-cyan transition-all duration-500"
                    style={{ WebkitTextStroke: '2px var(--theme-text-stroke)', WebkitTextFillColor: 'transparent' }}
              >
                {sponsor.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
