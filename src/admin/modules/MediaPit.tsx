import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, X, Star, Loader2, Play, Image, Film } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp, MediaFile } from '../../context/AppContext';
import { supabase } from '../../supabase';

const isVideoFile = (file: File) => file.type.startsWith('video/');
const isVideoUrl = (url: string) => /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url);

export function MediaPit() {
  const { media, setMedia } = useApp();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(async (file) => {
      const tempId = Date.now() + Math.random().toString();
      const mediaType: 'image' | 'video' = isVideoFile(file) ? 'video' : 'image';
      
      // Initially show as uploading in UI
      const newMedia: MediaFile = {
        id: tempId,
        url: URL.createObjectURL(file), // Temp preview
        progress: 0,
        featured: false,
        tag: '#TrackDay',
        type: mediaType
      };
      
      setMedia(prev => [newMedia, ...prev]);

      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${tempId}.${fileExt}`;
        
        // Supabase Storage uses standard fetch, we can simulate progress or just let it spin
        setMedia(prev => prev.map(m => m.id === tempId ? { ...m, progress: 50 } : m));
        
        const { error: uploadError, data: uploadData } = await supabase.storage.from('media').upload(fileName, file);
        
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);

        // Create DB record
        const newMediaDoc = {
          id: tempId,
          url: publicUrl,
          featured: false,
          tag: '#TrackDay',
          type: mediaType,
        };
        await supabase.from('media').insert(newMediaDoc);
        
        toast.success(mediaType === 'video' ? 'Video uploaded successfully 🎬' : 'Asset uploaded successfully 📸');

        // Local cleanup of mock will be overwritten by the listener returning the new media
        setMedia(prev => prev.filter(m => m.id !== tempId));
        
      } catch (err: any) {
        toast.error(err.message || 'Upload failed');
        setMedia(prev => prev.filter(m => m.id !== tempId));
      }
    });
  }, [setMedia]);

  const onDropRejected = useCallback((fileRejections: any[]) => {
    fileRejections.forEach((rejection) => {
      const { file, errors } = rejection;
      errors.forEach((error: any) => {
        if (error.code === 'file-too-large') {
          toast.error(`"${file.name}" is too large. Max size is 50MB.`);
        } else if (error.code === 'file-invalid-type') {
          toast.error(`"${file.name}" has an invalid file type.`);
        } else {
          toast.error(`"${file.name}" rejected: ${error.message}`);
        }
      });
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    onDropRejected,
    accept: { 
      'image/*': [],
      'video/mp4': [],
      'video/webm': [],
      'video/quicktime': [],
    },
    maxSize: 50 * 1024 * 1024 
  });

  const handleDelete = async (item: MediaFile) => {
    // Delete from storage (parse filename from URL, basic approach)
    try {
      const urlParts = item.url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      await supabase.storage.from('media').remove([fileName]);
    } catch(e) {}
    
    // Delete from DB
    await supabase.from('media').delete().eq('id', item.id);
    toast.error('Asset deleted', { icon: '🗑️' });
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    await supabase.from('media').update({ featured: !currentFeatured }).eq('id', id);
    toast.success('Featured asset updated');
  };

  const updateTag = async (id: string, tag: string) => {
    await supabase.from('media').update({ tag }).eq('id', id);
  };

  const getMediaType = (item: MediaFile): 'image' | 'video' => {
    if (item.type) return item.type;
    return isVideoUrl(item.url) ? 'video' : 'image';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h2 className="display-text text-3xl font-black italic mb-2">Media <span className="neon-cyan-text">Pit</span></h2>
        <p className="text-gray-400 font-mono text-sm">Upload, tag, and feature gallery assets.</p>
      </div>

      <div 
        {...getRootProps()} 
        className={`glass-card border-2 border-dashed p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
          isDragActive ? 'border-cyan bg-cyan/5 glow-cyan' : 'border-white/20 hover:border-white/50 hover:bg-white/5'
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className={`w-12 h-12 mb-4 transition-colors ${isDragActive ? 'text-cyan' : 'text-gray-500'}`} />
        <p className="text-lg font-bold uppercase tracking-widest mb-2">Drop Assets Here</p>
        <p className="text-xs font-mono text-gray-500">Supports JPG, PNG, WEBP, MP4, WEBM, MOV (Max 50MB)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {media.map((item) => {
            const itemType = getMediaType(item);
            return (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`glass-card overflow-hidden group relative border ${item.featured ? 'border-cyan glow-cyan' : 'border-white/10'}`}
              >
                <div className="relative h-48 bg-black">
                  {itemType === 'video' ? (
                    <>
                      <video 
                        src={item.url}
                        muted
                        playsInline
                        preload="metadata"
                        className={`w-full h-full object-cover transition-opacity duration-300 ${item.progress < 100 ? 'opacity-30 grayscale' : 'opacity-80 group-hover:opacity-100'}`}
                        onMouseEnter={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                        onMouseLeave={(e) => { const v = e.target as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
                      />
                      {/* Video type badge */}
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm text-white text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10">
                        <Film className="w-3 h-3 text-neon-orange" />
                        Video
                      </div>
                      {/* Play overlay */}
                      {(item.progress === undefined || item.progress === 100) && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60 group-hover:opacity-0 transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-black/60 border border-white/20 flex items-center justify-center">
                            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <img 
                        src={item.url} 
                        alt="Upload preview" 
                        className={`w-full h-full object-cover transition-opacity duration-300 ${item.progress < 100 ? 'opacity-30 grayscale' : 'opacity-80 group-hover:opacity-100'}`} 
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm text-white text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10">
                        <Image className="w-3 h-3 text-cyan" />
                        Image
                      </div>
                    </>
                  )}
                  
                  {item.progress !== undefined && item.progress < 100 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Loader2 className="w-8 h-8 text-cyan animate-spin mb-2" />
                      <span className="text-xs font-mono font-bold">{Math.floor(item.progress)}%</span>
                    </div>
                  )}

                  {(item.progress === undefined || item.progress === 100) && (
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => toggleFeatured(item.id, item.featured)}
                        className={`p-2 rounded-full backdrop-blur-md border ${item.featured ? 'bg-cyan text-[#000000] border-cyan' : 'bg-black/50 text-[#ffffff] border-white/20 hover:bg-cyan hover:text-[#000000]'} transition-colors`}
                      >
                        <Star className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item)}
                        className="p-2 bg-black/50 hover:bg-red-500 hover:text-white backdrop-blur-md border border-white/20 hover:border-red-500 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  {item.progress !== undefined && item.progress < 100 && (
                    <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full">
                      <div className="h-full bg-cyan transition-all duration-300 ease-linear shadow-[0_0_10px_rgba(34,211,238,0.8)]" style={{ width: `${item.progress}%` }} />
                    </div>
                  )}
                </div>
                
                <div className="p-4 border-t border-white/10">
                  <input 
                    type="text" 
                    value={item.tag}
                    onChange={(e) => {
                      const localItems = media.map(m => m.id === item.id ? { ...m, tag: e.target.value } : m);
                      setMedia(localItems);
                    }}
                    onBlur={(e) => updateTag(item.id, e.target.value)}
                    placeholder="Enter #Tag or Caption"
                    className="w-full bg-transparent text-sm font-mono text-gray-300 focus:text-white border-b border-transparent focus:border-cyan/50 focus:outline-none py-1 transition-colors"
                    disabled={item.progress !== undefined && item.progress < 100}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
