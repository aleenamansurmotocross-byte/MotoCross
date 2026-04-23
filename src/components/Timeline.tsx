import { motion } from 'motion/react';
import { Target, Trophy, ChevronsRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Timeline() {
  const { achievements } = useApp();

  return (
    <section className="py-32 relative z-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20">
          
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-black italic uppercase display-text mb-6">
                Chasing <span className="neon-cyan-text">Glory</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                From local dirt tracks to international stadiums, Aleena's journey is defined by relentless speed and precise control. Every race is a stepping stone to global domination.
              </p>

              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">
                {achievements.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-dark-bg bg-charcoal text-cyan group-hover:bg-cyan group-hover:text-dark-bg group-hover:glow-cyan transition-all duration-300 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <Trophy className="w-4 h-4" />
                    </div>
                    
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-6 rounded-xl border border-white/5 group-hover:border-white/20 transition-colors">
                      <div className="neon-orange-text font-bold font-mono text-sm mb-2">{item.year}</div>
                      <h3 className="text-xl font-bold mb-2 font-display">{item.eventName}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.rank} Finish — {item.category}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="sticky top-24 glass-card p-10 md:p-14 rounded-3xl border border-cyan/20 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan/10 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-orange/10 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-cyan/10 rounded-lg text-cyan">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black italic display-text uppercase">The Future</h3>
              </div>
              
              <h4 className="text-2xl font-bold mb-4">Eyes on the Ultimate Prize</h4>
              <p className="text-gray-300 mb-8 leading-relaxed">
                The objective is clear. Building the skill, endurance, and backing required to compete at the absolute highest level of the sport.
              </p>
              
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="mt-1 text-cyan"><ChevronsRight className="w-5 h-5" /></div>
                  <div>
                    <h5 className="font-bold text-lg">FIM WMXGP</h5>
                    <p className="text-gray-400 text-sm mt-1">Competing in the Women's Motocross World Championship against the fastest riders on the planet.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1 text-neon-orange"><ChevronsRight className="w-5 h-5" /></div>
                  <div>
                    <h5 className="font-bold text-lg">Dakar Rally</h5>
                    <p className="text-gray-400 text-sm mt-1">Conquering the world's most grueling endurance rally in the motorcycle category.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
