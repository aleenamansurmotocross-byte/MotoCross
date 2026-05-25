import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Youtube, Trash2, Loader2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../supabase';

export function VideoManager() {
  const { videos, setVideos } = useApp();
  
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  
  const extractVideoId = (inputUrl: string) => {
    const shortsMatch = inputUrl.match(/(?:shorts\/)([^&?/\s]+)/);
    if (shortsMatch) {
      return `short-${shortsMatch[1]}`;
    }
    const match = inputUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    return match ? match[1] : null;
  };

  const previewVideoId = extractVideoId(url);
  const isPreviewShort = previewVideoId ? previewVideoId.startsWith('short-') : false;
  const actualPreviewId = previewVideoId ? (isPreviewShort ? previewVideoId.substring(6) : previewVideoId) : '';

  const clearForm = () => {
    setUrl('');
    setTitle('');
    setDescription('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewVideoId) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }

    setSaving(true);
    try {
      const newVideo = {
        video_id: previewVideoId,
        title: title.trim() || null,
        description: description.trim() || null,
      };

      const { error: dbError } = await supabase.from('youtube_videos').insert([newVideo]);
      if (dbError) throw dbError;

      // Re-fetch videos
      const { data: updatedVideos } = await supabase.from('youtube_videos').select('*').order('created_at', { ascending: false });
      if (updatedVideos) setVideos(updatedVideos as any);

      toast.success('Video added successfully');
      clearForm();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add video. Did you create the table?');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this video?')) return;
    
    try {
      const { error } = await supabase.from('youtube_videos').delete().eq('id', id);
      if (error) throw error;
      
      setVideos(prev => prev.filter(v => v.id !== id));
      toast.success('Video removed');
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove video');
    }
  };

  return (
    <div className="flex-1 p-8 h-screen overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h2 className="display-text text-3xl font-black italic uppercase">
            Video <span className="neon-cyan-text">Manager</span>
          </h2>
          <p className="text-gray-400 font-mono mt-2 text-sm uppercase tracking-wider">
            Manage YouTube videos for the gallery
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Form */}
          <div className="glass-card p-6 border-cyan/20">
            <h3 className="text-xl font-black italic uppercase display-text mb-6">Add New Video</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">YouTube URL *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-4 w-4 text-gray-500" />
                  </div>
                  <input 
                    type="url" 
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-all"
                    required
                  />
                </div>
              </div>
              
              {previewVideoId && (
                <div className={`relative rounded-xl border border-white/10 overflow-hidden bg-black/50 group ${isPreviewShort ? 'aspect-[9/16] max-w-[200px] mx-auto' : 'aspect-video'}`}>
                  <img 
                    src={`https://img.youtube.com/vi/${actualPreviewId}/hqdefault.jpg`} 
                    alt="Preview" 
                    className="w-full h-full object-cover opacity-80" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Youtube className="w-12 h-12 text-red-600 fill-white" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Video Title (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ImageIcon className="h-4 w-4 text-gray-500" />
                  </div>
                  <input 
                    type="text" 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Supercross Finals 2026"
                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Description (Optional)</label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Short description..."
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-all h-24 resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={saving || !previewVideoId}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                ) : (
                  <>Save Video</>
                )}
              </button>
            </form>
          </div>

          {/* Existing Videos Grid */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-black italic uppercase display-text mb-6">Active Videos ({videos?.length || 0})</h3>
            
            {(!videos || videos.length === 0) ? (
              <div className="glass-card p-12 text-center text-gray-500 border-dashed">
                <Youtube className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No videos added yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {videos.map(video => {
                    const isShort = video.video_id.startsWith('short-');
                    const actualVideoId = isShort ? video.video_id.substring(6) : video.video_id;

                    return (
                      <motion.div 
                        key={video.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="glass-card border-white/5 overflow-hidden group flex flex-col relative"
                      >
                        <button 
                          onClick={() => handleDelete(video.id)}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/80 text-white rounded opacity-0 group-hover:opacity-100 transition-all z-20"
                          title="Delete Video"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className={`bg-black relative flex items-center justify-center overflow-hidden ${isShort ? 'aspect-[9/16] max-h-[300px]' : 'aspect-video'}`}>
                          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm text-white text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10 z-10">
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

                          <img 
                            src={`https://img.youtube.com/vi/${actualVideoId}/hqdefault.jpg`} 
                            alt={video.title || 'YouTube Video'} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none drop-shadow-lg">
                             <Youtube className="w-10 h-10 text-white opacity-80" />
                          </div>
                        </div>
                        
                        <div className="p-3 border-t border-white/5 flex-1 flex flex-col justify-center">
                          <p className="font-bold text-sm truncate">{video.title || 'Untitled Video'}</p>
                          <p className="text-xs text-gray-500 truncate mt-1">ID: {actualVideoId}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
