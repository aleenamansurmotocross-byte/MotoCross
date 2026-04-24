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
              className="px-6 md:px-10 flex items-center justify-center opacity-60 hover:opacity-100 transition-all duration-500 cursor-pointer group"
            >
              <div 
                className="p-4 md:p-6 rounded-2xl flex items-center justify-center transition-all duration-500 border border-transparent group-hover:border-cyan/30 hover:bg-white/5 shadow-lg min-w-[200px] h-[120px]"
              >
                <img 
                  src={sponsor.logo} 
                  alt={sponsor.name} 
                  className="max-h-16 md:max-h-20 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <span className="hidden text-2xl md:text-3xl font-black italic display-text uppercase text-transparent bg-clip-text group-hover:neon-cyan-text group-hover:text-cyan transition-all duration-500"
                      style={{ WebkitTextStroke: '2px var(--theme-text)', WebkitTextFillColor: 'transparent' }}
                >
                  {sponsor.name}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
