import { animate, motion, useInView } from 'motion/react';
import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

function Counter({ from, to, duration = 2, suffix = '' }: { from: number, to: number, duration?: number, suffix?: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: '-50px' });

  useEffect(() => {
    if (inView) {
      const controls = animate(from, to, {
        duration,
        ease: 'easeOut',
        onUpdate(value) {
          if (nodeRef.current) {
            nodeRef.current.textContent = value.toFixed(0) + suffix;
          }
        },
      });
      return () => controls.stop();
    }
  }, [from, to, duration, inView, suffix]);

  return <span ref={nodeRef}>{from}{suffix}</span>;
}

export function Stats() {
  const { stats } = useApp();
  
  const statList = [
    { label: 'Years Exp', value: stats.experience, suffix: '+' },
    { label: 'Career Wins', value: stats.wins, suffix: '' },
    { label: 'Podium Finishes', value: stats.podiums, suffix: '' },
    { label: 'Total Races', value: stats.races, suffix: '' },
  ];

  return (
    <section className="py-24 relative z-20 bg-charcoal/50 border-y border-white/5 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {statList.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass-card p-8 rounded-tr-3xl rounded-bl-3xl border border-white/5 hover:border-cyan/30 transition-colors group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-cyan/10 blur-2xl group-hover:bg-cyan/20 transition-colors" />
              <div className={`text-5xl md:text-6xl font-black italic display-text mb-2 ${stat.label === 'Years Exp' ? 'neon-cyan-text' : stat.label === 'Career Wins' ? 'neon-orange-text' : 'text-white'}`}>
                <Counter from={0} to={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs uppercase tracking-tighter text-gray-400 font-bold">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
