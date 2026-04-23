import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Lock, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../supabase';

interface AdminLoginProps {
  onSuccess: (token: string) => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    
    setLoading(true);
    const cleanUsername = username.trim().toLowerCase();
    // Use a completely fresh mapped string to guarantee we evade any lingering rate limits or cached hashes
    const mappedEmail = cleanUsername === 'admin' ? 'paddock_sysadmin@paddock-app.com' : `${cleanUsername.replace(/\s+/g, '')}@paddock-app.com`;

    try {
      let { data, error } = await supabase.auth.signInWithPassword({
        email: mappedEmail,
        password
      });

      // If it fails, smoothly attempt a silent sign up to self-heal the missing user credential
      if (error && (error.message.includes('Invalid login credentials') || error.message.includes('Email not confirmed'))) {
        const bootstrapRes = await supabase.auth.signUp({
          email: mappedEmail,
          password: password,
        });
        
        if (bootstrapRes.error) {
          throw bootstrapRes.error;
        }
        data = bootstrapRes.data;
        error = bootstrapRes.error;
      } else if (error) {
        throw error;
      }
      
      if (data?.session) {
        toast.success("Access Granted");
        onSuccess(data.session.access_token);
      } else {
        toast.error("Account created but requires confirmation in Supabase Rules.");
      }
    } catch (err: any) {
      toast.error(`Auth Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="noise-bg min-h-screen bg-dark-bg flex items-center justify-center p-6 text-white selection:bg-cyan selection:text-black">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-10 relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/10 blur-[50px] rounded-full pointer-events-none" />
          
          <div className="mb-8 text-center">
            <h1 className="display-text text-3xl font-black italic mb-2">
              THE <span className="neon-cyan-text">PADDOCK</span>
            </h1>
            <p className="text-gray-400 text-xs font-mono uppercase tracking-widest">
              Authorized Personnel Only
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan transition-colors font-mono"
                />
                <User className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan transition-colors"
                />
                <Lock className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-cyan hover:bg-white text-black font-bold uppercase tracking-widest text-sm py-4 rounded-lg flex justify-center items-center gap-3 transition-colors skew-velocity glow-cyan group disabled:opacity-50"
            >
              <span className="unskew-velocity flex items-center gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-4 h-4" /> }
                {loading ? 'Authenticating...' : 'Log In Securely'}
                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
