import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, ShieldAlert, Loader2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../supabase';

type AdminUser = { email: string; addedAt: number };

export function AdminManager() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      const { data, error } = await supabase.from('admins').select('*');
      if (error) {
        toast.error('Failed to load admins');
      } else {
        setAdmins(data || []);
      }
      setLoading(false);
    };

    fetchAdmins();

    const sub = supabase.channel('admins-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admins' }, () => {
        fetchAdmins();
      }).subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return toast.error("Enter a valid username");
    
    // Normalize to lowercase
    const normalizedUsername = newEmail.toLowerCase().trim().replace(/\s+/g, '');
    const mappedEmail = `${normalizedUsername}@paddock.local`;
    
    try {
      const { error } = await supabase.from('admins').insert({
        email: mappedEmail,
        addedAt: Date.now()
      });
      if (error) throw error;
      setNewEmail('');
      toast.success("Admin authorized and padded to roster");
    } catch (err: any) {
      toast.error(err.message || 'Failed to add admin');
    }
  };

  const handleDelete = async (email: string) => {
    if (email === 'paddock_sysadmin@paddock-app.com') return toast.error("Cannot remove super admin");
    
    try {
      const { error } = await supabase.from('admins').delete().eq('email', email);
      if (error) throw error;
      toast.error("Admin access revoked");
    } catch (err: any) {
       toast.error(err.message || 'Failed to remove admin');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <h2 className="display-text text-3xl font-black italic mb-2">Access <span className="neon-cyan-text">Control</span></h2>
          <p className="text-gray-400 font-mono text-sm">Manage who has keys to the paddock.</p>
        </div>
      </div>

      <div className="glass-card p-6 border-l-4 border-cyan">
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-cyan/10 p-3 rounded-full text-cyan">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold uppercase tracking-widest text-white">Authorize New Client</h3>
            <p className="text-sm text-gray-400 font-mono mt-1">Add their username below. They can log in with a password to access the Paddock securely.</p>
          </div>
        </div>
        
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="johndoe"
            className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:border-cyan outline-none"
            required
          />
          <button 
            type="submit"
            className="bg-cyan hover:bg-white text-black px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors skew-velocity min-w-[140px]"
          >
            <span className="unskew-velocity flex items-center gap-2">
              <Plus className="w-4 h-4" /> Grant Access
            </span>
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold uppercase tracking-widest text-gray-500 text-xs mb-4">Authorized Personnel</h3>
        
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-cyan" /></div>
        ) : (
          <div className="grid gap-3">
            {/* Hardcoded Super Admin */}
            <div className="glass-card p-4 flex items-center justify-between border-white/5 opacity-80">
              <div className="flex items-center gap-4">
                <ShieldCheck className="w-5 h-5 text-cyan" />
                <div>
                   <p className="font-bold text-white font-mono">admin</p>
                   <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Creator / Super Admin</p>
                </div>
              </div>
            </div>

            {/* Dynamic Admins */}
            <AnimatePresence>
              {admins.filter(a => a.email !== 'paddock_sysadmin@paddock-app.com').map((admin) => (
                <motion.div 
                  key={admin.email}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card p-4 flex items-center justify-between border-white/10"
                >
                  <div className="flex items-center gap-4">
                     <ShieldCheck className="w-5 h-5 text-gray-400" />
                     <div>
                        <p className="font-bold text-white font-mono">{admin.email.replace('@paddock.local', '')}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Client Admin</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(admin.email)}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                    title="Revoke access"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
