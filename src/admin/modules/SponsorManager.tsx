import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, X, Trash2, Loader2, Image as ImageIcon, Link as LinkIcon, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../supabase';

export function SponsorManager() {
  const { sponsors, setSponsors } = useApp();
  
  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp']
    },
    maxFiles: 1
  });

  const clearForm = () => {
    setName('');
    setLink('');
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please upload a sponsor logo first');
      return;
    }

    setUploading(true);
    try {
      const tempId = crypto.randomUUID();
      const fileExt = file.name.split('.').pop();
      const fileName = `${tempId}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('sponsors').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('sponsors').getPublicUrl(fileName);

      const newSponsorDoc = {
        name: name.trim() || null,
        link: link.trim() || null,
        logo: publicUrl
      };

      const { error: dbError } = await supabase.from('sponsors').insert([newSponsorDoc]);
      if (dbError) throw dbError;

      // Re-fetch sponsors to update the grid immediately
      const { data: updatedSponsors } = await supabase.from('sponsors').select('*').order('created_at', { ascending: true });
      if (updatedSponsors) setSponsors(updatedSponsors as any);

      toast.success('Sponsor added successfully');
      clearForm();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add sponsor');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, logoUrl: string) => {
    if (!window.confirm('Are you sure you want to remove this sponsor?')) return;
    
    try {
      // Extract filename from URL (assuming standard Supabase public URL format)
      const fileName = logoUrl.split('/').pop();
      if (fileName) {
        await supabase.storage.from('sponsors').remove([fileName]);
      }
      
      const { error } = await supabase.from('sponsors').delete().eq('id', id);
      if (error) throw error;
      
      setSponsors(prev => prev.filter(s => s.id !== id));
      toast.success('Sponsor removed');
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove sponsor');
    }
  };

  return (
    <div className="flex-1 p-8 h-screen overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h2 className="display-text text-3xl font-black italic uppercase">
            Sponsor <span className="neon-cyan-text">Manager</span>
          </h2>
          <p className="text-gray-400 font-mono mt-2 text-sm uppercase tracking-wider">
            Manage sponsor logos and relationships
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="glass-card p-6 border-cyan/20">
            <h3 className="text-xl font-black italic uppercase display-text mb-6">Add New Sponsor</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Sponsor Logo *</label>
                {!preview ? (
                  <div 
                    {...getRootProps()} 
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                      isDragActive ? 'border-cyan bg-cyan/5' : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <UploadCloud className={`w-10 h-10 mx-auto mb-4 ${isDragActive ? 'text-cyan' : 'text-gray-500'}`} />
                    <p className="text-sm font-bold">Drag & drop or click to select</p>
                    <p className="text-xs text-gray-500 mt-2 font-mono">PNG, JPG, SVG, WebP</p>
                  </div>
                ) : (
                  <div className="relative rounded-xl border border-white/10 overflow-hidden bg-black/50 p-4 flex items-center justify-center h-48 group">
                    <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain" />
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); clearForm(); }}
                      className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Sponsor Name (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ImageIcon className="h-4 w-4 text-gray-500" />
                  </div>
                  <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Aligned Automation"
                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Website Link (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-4 w-4 text-gray-500" />
                  </div>
                  <input 
                    type="url" 
                    value={link}
                    onChange={e => setLink(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={uploading || !file}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</>
                ) : (
                  <>Save Sponsor</>
                )}
              </button>
            </form>
          </div>

          {/* Existing Sponsors Grid */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-black italic uppercase display-text mb-6">Active Sponsors ({sponsors.length})</h3>
            
            {sponsors.length === 0 ? (
              <div className="glass-card p-12 text-center text-gray-500 border-dashed">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No sponsors added yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <AnimatePresence>
                  {sponsors.map(sponsor => (
                    <motion.div 
                      key={sponsor.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="glass-card border-white/5 overflow-hidden group flex flex-col relative"
                    >
                      <button 
                        onClick={() => handleDelete(sponsor.id, sponsor.logo)}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/80 text-white rounded opacity-0 group-hover:opacity-100 transition-all z-10"
                        title="Delete Sponsor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="bg-white/5 p-4 h-32 flex items-center justify-center">
                        <img 
                          src={sponsor.logo} 
                          alt={sponsor.name || 'Sponsor'} 
                          className="max-h-full max-w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      
                      <div className="p-3 border-t border-white/5 flex-1 flex flex-col justify-center">
                        <p className="font-bold text-sm truncate">{sponsor.name || 'Unnamed'}</p>
                        {sponsor.link ? (
                          <a href={sponsor.link} target="_blank" rel="noreferrer" className="text-xs text-cyan hover:underline truncate mt-1">
                            {sponsor.link.replace(/^https?:\/\//, '')}
                          </a>
                        ) : (
                          <p className="text-xs text-gray-500 mt-1">No link provided</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
