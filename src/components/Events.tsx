import { motion } from 'motion/react';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Events() {
  const { races } = useApp();
  
  // We attach a placeholder image loop for aesthetic purposes if custom not provided
  const placeholderImages = [
    '/images/event_1.jpg',
    '/images/event_2.jpg',
    '/images/event_3.jpg'
  ];

  return (
    <section id="events" className="py-24 relative z-20 bg-charcoal/30">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black italic uppercase display-text">
              Race <span className="neon-orange-text">Calendar</span>
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {races.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-2xl overflow-hidden group cursor-pointer border border-white/5 hover:border-cyan/50 hover:glow-cyan transition-all duration-500 flex flex-col"
            >
              <div className="relative h-60 overflow-hidden">
                <div className="absolute inset-0 bg-dark-bg/20 z-10 transition-opacity group-hover:opacity-0" />
                <img 
                  src={event.image_url || placeholderImages[i % placeholderImages.length]} 
                  alt={event.name} 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 z-20">
                  <span className="bg-charcoal/80 backdrop-blur-md text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full border border-white/10 text-white">
                    {event.status}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between relative">
                <div>
                  <h3 className="text-2xl font-black italic display-text uppercase leading-tight mb-4 group-hover:neon-cyan-text transition-colors">
                    {event.name}
                  </h3>
                  
                  <div className="space-y-3 mb-6 relative z-10">
                    <div className="flex items-center gap-3 text-gray-400">
                      <MapPin className="w-5 h-5 text-neon-orange" />
                      <span className="text-sm font-medium">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <Calendar className="w-5 h-5 text-cyan" />
                      <span className="text-sm font-medium">{event.date}</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/10">
                  <a href="#contact" className="btn-primary w-full group">
                    Register Interest <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 flex justify-center w-full px-4 sm:px-0"
        >
          <a
            href="#events"
            className="btn-primary group w-full sm:w-auto"
          >
            All Events <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
