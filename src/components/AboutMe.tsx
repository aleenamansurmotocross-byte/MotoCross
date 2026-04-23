import { motion } from 'motion/react';
import { Target, Zap, Flag, Trophy } from 'lucide-react';

export function AboutMe() {
  const infoCards = [
    { label: 'Bike', value: 'Husqvarna TC85', icon: Zap, color: 'neon-cyan-text', borderColor: 'border-cyan/30' },
    { label: 'Category', value: '85cc Juniors SX-2', icon: Target, color: 'text-white', borderColor: 'border-white/10' },
    { label: 'Team', value: 'Aligned Automation', icon: Flag, color: 'neon-orange-text', borderColor: 'border-neon-orange/30' },
    { label: 'Experience', value: '7+ years', icon: Trophy, color: 'text-white', borderColor: 'border-white/10' },
  ];

  return (
    <section id="about" className="py-24 relative z-20 bg-dark-bg border-t border-white/5">
      <div className="container mx-auto px-6">
        
        {/* About Me Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:text-center"
        >
          <h2 className="text-4xl md:text-5xl font-black italic uppercase display-text">
            About <span className="neon-orange-text">Aleena</span>
          </h2>
        </motion.div>

        {/* 2-Column Layout */}
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-16">
          
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan/20 to-neon-orange/20 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative glass-card rounded-2xl overflow-hidden border border-white/10 glow-cyan">
              <img 
                src="/images/gallery_1.jpg" 
                alt="Aleena Mansur Profile" 
                className="w-full h-auto object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2 space-y-6 text-gray-300 font-light text-lg md:text-xl leading-relaxed"
          >
            <p>
              <strong className="text-white font-bold">Aleena Mansur</strong> is not just a competitor; she is a trailblazer accelerating the future of Indian motorsport. Beginning her journey at a young age, she has quickly established herself as one of India's most exciting young talents. Her presence on the track is defined by fearless riding and a relentless pursuit of progress, inspiring a new generation.
            </p>
            <p>
              From local tracks to international championships, she continues to push both herself and her machine to the limit. The roar of the engine, the spray of dirt, and the thrill of competition fuel her journey. She aims to represent India in prestigious global events like the FIM WMXGP World Championship, BAJA World Championship, Dakar Rally, and Abu Dhabi BAJA Desert Challenge.
            </p>
          </motion.div>
        </div>

        {/* 4-Box Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {infoCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`glass-card p-8 rounded-xl border ${card.borderColor} hover:border-cyan/50 hover:bg-white/5 transition-all duration-300 group`}
              >
                <div className="mb-4">
                  <Icon className="w-8 h-8 text-gray-400 group-hover:text-cyan transition-colors" />
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold mb-2">
                  {card.label}
                </div>
                <div className={`text-xl font-black italic display-text uppercase ${card.color}`}>
                  {card.value}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
