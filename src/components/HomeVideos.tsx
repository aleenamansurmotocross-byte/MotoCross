import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Play, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp, YouTubeVideo } from '../context/AppContext';
import { useState } from 'react';

export function HomeVideos() {
  const { videos } = useApp();
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  // Take the 5 latest videos based on creation date or just the first 5
  const displayVideos = [...(videos || [])].sort((a, b) => 
    new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  ).slice(0, 5);

  if (displayVideos.length === 0) return null;

  return (
    <section id="videos" className={`pb-24 relative bg-dark-bg ${selectedVideo ? 'z-[100]' : 'z-20'}`}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black italic uppercase display-text">
              Trackside <span className="neon-cyan-text">Videos</span>
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:block"
          >
            <Link 
              to="/gallery#videos" 
              className="text-sm font-bold uppercase tracking-wider text-cyan hover:text-white transition-colors flex items-center gap-2"
            >
              View All Videos <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {displayVideos.map((video, i) => {
            const isShort = video.video_id.startsWith('short-');
            const actualVideoId = isShort ? video.video_id.substring(6) : video.video_id;

            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => setSelectedVideo(video)}
                className={`relative overflow-hidden group rounded-xl border border-white/5 glass-card cursor-pointer ${
                  isShort ? 'aspect-[9/16] h-auto' : 'h-64 lg:h-80 aspect-video lg:aspect-auto'
                }`}
              >
                <img 
                  src={`https://img.youtube.com/vi/${actualVideoId}/hqdefault.jpg`}
                  alt={video.title || "Video thumbnail"}
                  className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                  loading="lazy"
                />
                
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm text-white text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10 z-10">
                  {isShort ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                      Short
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan"></span>
                      Video
                    </>
                  )}
                </div>

                <div className="absolute inset-0 bg-cyan/0 group-hover:bg-cyan/10 transition-colors duration-300 z-10 mix-blend-overlay" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 transition-all duration-300">
                   <div className="w-14 h-14 rounded-full bg-red-600/90 border-2 border-white/30 flex items-center justify-center backdrop-blur-sm drop-shadow-2xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                     <Play className="w-6 h-6 text-white fill-white ml-1" />
                   </div>
                </div>
                {video.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-bold line-clamp-2 drop-shadow-md">{video.title}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex justify-center md:hidden"
        >
          <Link 
            to="/gallery#videos" 
            className="btn-primary group"
          >
            View All Videos <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* Video Modal Popup */}
      <AnimatePresence>
        {selectedVideo && (() => {
          const isShort = selectedVideo.video_id.startsWith('short-');
          const actualVideoId = isShort ? selectedVideo.video_id.substring(6) : selectedVideo.video_id;

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-6 md:p-12 backdrop-blur-md"
            >
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedVideo(null); }}
                className="absolute top-6 right-6 text-white hover:text-cyan transition-colors bg-charcoal/50 p-3 rounded-full border border-white/10 hover:border-cyan glow-cyan z-[110]"
                aria-label="Close video"
              >
                <X className="w-6 h-6" />
              </button>

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className={`relative w-full rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,255,255,0.15)] border border-white/10 ${
                  isShort ? 'aspect-[9/16] max-w-md max-h-[85vh]' : 'aspect-video max-w-5xl'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${actualVideoId}?autoplay=1`}
                  title={selectedVideo.title || "YouTube video player"}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </section>
  );
}
