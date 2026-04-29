import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Announcement } from '../../context/AppContext';

export function AnnouncementManager() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [isActive, setIsActive] = useState(false);
  const [title, setTitle] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonLink, setButtonLink] = useState('');

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    try {
      const { data, error } = await supabase.from('announcement').select('*').single();
      if (error && error.code !== 'PGRST116') throw error; // Ignore not found error
      
      if (data) {
        setAnnouncement(data);
        setIsActive(data.is_active);
        setTitle(data.title);
        setButtonText(data.button_text || '');
        setButtonLink(data.button_link || '');
      }
    } catch (err: any) {
      toast.error('Failed to load announcement settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        id: announcement?.id || 1, // Ensure there is always a default ID like 1 if empty
        is_active: isActive,
        title: title.trim(),
        button_text: buttonText.trim() || null,
        button_link: buttonLink.trim() || null,
      };

      const { error } = await supabase.from('announcement').upsert(payload);
      if (error) throw error;

      toast.success('Announcement settings updated');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save announcement');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-cyan" /></div>;
  }

  return (
    <div className="glass-card p-6 border-cyan/20">
      <h3 className="text-xl font-black italic uppercase display-text mb-6">Announcement Banner</h3>
      
      <form onSubmit={handleSave} className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? 'bg-cyan' : 'bg-white/10'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <label className="text-sm font-bold uppercase tracking-wider">
            Banner {isActive ? <span className="text-cyan">Visible</span> : <span className="text-gray-500">Hidden</span>}
          </label>
        </div>

        <div className={`space-y-6 transition-opacity duration-300 ${!isActive ? 'opacity-50 pointer-events-none' : ''}`}>
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Announcement Text *</label>
            <input 
              type="text" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. New Interview Out Now!"
              required={isActive}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Button Text (Optional)</label>
              <input 
                type="text" 
                value={buttonText}
                onChange={e => setButtonText(e.target.value)}
                placeholder="e.g. Watch Now"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-all"
              />
            </div>
            
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Button Link (Optional)</label>
              <input 
                type="url" 
                value={buttonLink}
                onChange={e => setButtonLink(e.target.value)}
                placeholder="https://youtube.com/..."
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-cyan focus:ring-1 focus:ring-cyan outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={saving}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
          ) : (
            <>Save Settings</>
          )}
        </button>
      </form>
    </div>
  );
}
