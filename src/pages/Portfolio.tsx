import { Canvas } from '@react-three/fiber';
import { Navbar } from '../components/Navbar';
import { SponsorStrip } from '../components/SponsorStrip';
import { AnnouncementBanner } from '../components/AnnouncementBanner';
import { Hero } from '../components/Hero';
import { AboutMe } from '../components/AboutMe';
import { Sponsors } from '../components/Sponsors';
import { Stats } from '../components/Stats';
import { Timeline } from '../components/Timeline';
import { HomeGallery } from '../components/HomeGallery';
import { Events } from '../components/Events';
import { Contact } from '../components/Contact';
import { ThreeBackground } from '../components/ThreeBackground';
import { Link } from 'react-router-dom';

export function Portfolio() {
  return (
    <main className="noise-bg min-h-screen bg-dark-bg selection:bg-cyan selection:text-black pt-[111px] md:pt-[121px]">
      {/* 3D Background layer */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-60">
        <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#FF4D00" />
          <ThreeBackground />
        </Canvas>
      </div>

      {/* Foreground Content */}
      <Navbar />
      <div className="flex flex-col w-full relative z-40">
        <SponsorStrip />
        <AnnouncementBanner />
      </div>
      <Hero />
      <AboutMe />
      <Sponsors />
      <Stats />
      <Timeline />
      <HomeGallery />
      <Events />
      <Contact />

      <footer className="py-8 border-t border-white/5 relative z-20 text-center text-gray-500 text-sm">
        <p className="uppercase tracking-widest font-bold">&copy; {new Date().getFullYear()} Aleena Mansur. All Rights Reserved.</p>
      </footer>
    </main>
  );
}
