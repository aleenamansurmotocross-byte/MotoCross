import { motion } from 'motion/react';
import { ArrowLeft, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
export function Achievements() {
  const { achievements } = useApp();
  const displayAchievements = achievements;

  return (
    <div className="noise-bg min-h-screen bg-dark-bg text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-16">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-gray-400 hover:text-cyan transition-colors group text-sm font-bold uppercase tracking-widest"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Paddock
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-12 h-[2px] bg-cyan"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan">Career Stats</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="display-text text-5xl md:text-7xl font-black italic uppercase mb-4 tracking-tighter">
            Full <span className="neon-cyan-text">Career</span> Highlights
          </h1>
          <p className="text-gray-400 max-w-xl text-lg font-light">
            A comprehensive record of Aleena's podium finishes and victories across local and national championships.
          </p>
        </motion.div>

        <div className="space-y-6 max-w-4xl">
          {displayAchievements.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: (i % 10) * 0.05 }}
              className="glass-card p-6 rounded-xl border border-white/5 hover:border-cyan/30 hover:bg-white/5 transition-all duration-300 flex flex-col md:flex-row md:items-center gap-6 group"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-charcoal border border-white/10 group-hover:border-cyan group-hover:glow-cyan group-hover:text-cyan text-gray-500 transition-all duration-300 shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="neon-orange-text font-bold font-mono text-sm px-2 py-1 bg-neon-orange/10 rounded">{item.year}</span>
                  <span className="text-cyan font-bold tracking-wider uppercase text-sm">{item.rank}</span>
                </div>
                <h3 className="text-2xl font-bold font-display uppercase tracking-tight">{item.eventName}</h3>
                <p className="text-gray-400 mt-2">{item.category}</p>
              </div>
            </motion.div>
          ))}
          
          {displayAchievements.length === 0 && (
             <div className="py-20 text-center text-gray-500 font-mono text-sm">
               No achievements recorded yet.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
