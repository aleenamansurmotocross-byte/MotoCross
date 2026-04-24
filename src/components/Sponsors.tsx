import { useApp } from '../context/AppContext';

export function Sponsors() {
  const { sponsors } = useApp();

  // Fallback to static data if no sponsors in DB yet
  const staticSponsors = [
    { id: 's1', name: 'ALIGNED AUTOMATION', logo: '/images/sponsors/aligned.png', link: undefined },
    { id: 's2', name: 'SCHOOL OF INDIA', logo: '/images/sponsors/school.png', link: undefined },
    { id: 's3', name: 'MFAR DEVELOPERS', logo: '/images/sponsors/mfar.png', link: undefined }
  ];

  const displaySponsors = sponsors.length > 0 ? sponsors : staticSponsors;

  // Need enough copies to fill screen + scroll seamlessly
  // With few sponsors, we need many copies to span the full viewport
  const repeatCount = Math.max(8, Math.ceil(20 / displaySponsors.length));
  const marqueeItems = Array.from({ length: repeatCount }, () => displaySponsors).flat();

  return (
    <section className="py-20 relative z-20 border-y border-white/5 bg-charcoal/80 overflow-hidden">
      <div className="container mx-auto px-6 mb-12">
        <h2 className="!text-center text-3xl md:text-4xl font-black italic uppercase display-text">
          <span className="text-gray-500">Sponsored</span> <span className="text-white">By</span>
        </h2>
      </div>
      
      <div className="relative overflow-hidden py-4">
        {/* Gradients for mask effect */}
        <div className="absolute top-0 left-0 w-32 h-full z-10 bg-gradient-to-r from-charcoal to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-full z-10 bg-gradient-to-l from-charcoal to-transparent pointer-events-none" />
        
        <div className="sponsor-marquee">
          <div className="sponsor-track">
            {marqueeItems.map((sponsor, i) => {
              const LogoContent = (
                <div 
                  className="p-4 md:p-6 rounded-2xl flex items-center justify-center transition-all duration-500 border border-white/10 group-hover:border-cyan/30 bg-white/90 shadow-lg min-w-[220px] h-[120px] group-hover:shadow-cyan/20 group-hover:shadow-xl"
                >
                  <img 
                    src={sponsor.logo} 
                    alt={sponsor.name || 'Sponsor'} 
                    className="max-h-16 md:max-h-20 object-contain transition-all duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <span className="hidden text-2xl md:text-3xl font-black italic display-text uppercase text-gray-800">
                    {sponsor.name}
                  </span>
                </div>
              );

              return (
                <div 
                  key={`${sponsor.id}-${i}`} 
                  className="sponsor-item flex items-center justify-center opacity-70 hover:opacity-100 transition-all duration-500 cursor-pointer group"
                >
                  {sponsor.link ? (
                    <a href={sponsor.link} target="_blank" rel="noopener noreferrer">
                      {LogoContent}
                    </a>
                  ) : (
                    LogoContent
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
