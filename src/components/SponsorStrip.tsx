import { useApp } from '../context/AppContext';

export function SponsorStrip() {
  const { sponsors } = useApp();

  // Fallback to same static sponsors as the main Sponsors section
  const staticSponsors = [
    { id: 's1', name: 'ALIGNED AUTOMATION', logo: '/images/sponsors/aligned.png', link: undefined },
    { id: 's2', name: 'SCHOOL OF INDIA',    logo: '/images/sponsors/school.png',  link: undefined },
    { id: 's3', name: 'MFAR DEVELOPERS',    logo: '/images/sponsors/mfar.png',    link: undefined },
  ];

  const displaySponsors = sponsors.length > 0 ? sponsors : staticSponsors;

  // Duplicate enough times so the strip never shows a blank gap at any viewport width.
  // We keep exactly TWO identical sets inside the track; CSS translateX(-50%) then
  // slides the whole thing left by exactly one set width — creating a seamless loop.
  const repeatCount = Math.max(6, Math.ceil(16 / displaySponsors.length));
  const set = Array.from({ length: repeatCount }, () => displaySponsors).flat();

  const stripItems = [...set, ...set]; // two identical halves

  return (
    <div
      className="sponsor-strip-wrapper"
      aria-label="Sponsors marquee"
      role="marquee"
    >
      {/* Left fade */}
      <div className="sponsor-strip-fade sponsor-strip-fade--left" aria-hidden="true" />

      <div className="sponsor-strip-marquee">
        <div className="sponsor-strip-track">
          {stripItems.map((sponsor, i) => {
            const img = (
              <div className="sponsor-strip-logo-box">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name || 'Sponsor'}
                  className="sponsor-strip-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const sib = e.currentTarget.nextElementSibling as HTMLElement | null;
                    if (sib) sib.style.display = 'block';
                  }}
                />
                {/* Fallback text when image fails */}
                <span className="sponsor-strip-fallback">{sponsor.name}</span>
              </div>
            );

            return (
              <div
                key={`strip-${sponsor.id}-${i}`}
                className="sponsor-strip-item"
              >
                {sponsor.link ? (
                  <a href={sponsor.link} target="_blank" rel="noopener noreferrer">
                    {img}
                  </a>
                ) : (
                  img
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right fade */}
      <div className="sponsor-strip-fade sponsor-strip-fade--right" aria-hidden="true" />
    </div>
  );
}
