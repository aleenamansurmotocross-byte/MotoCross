import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  CalendarDays, 
  Image as ImageIcon, 
  History, 
  Globe,
  LogOut,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { Telemetry } from './modules/Telemetry';
import { RaceCalendar } from './modules/RaceCalendar';
import { MediaPit } from './modules/MediaPit';
import { Achievements } from './modules/Achievements';
import { AdminManager } from './modules/AdminManager';
import { SponsorManager } from './modules/SponsorManager';
import { VideoManager } from './modules/VideoManager';
import { AdminLogin } from './AdminLogin';
import { Youtube } from 'lucide-react';

export function AdminDashboard() {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('admin_token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check Supabase's native session storage when dashboard mounts
    const checkSession = async () => {
      const { supabase } = await import('../supabase');
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setToken(session.access_token);
        sessionStorage.setItem('admin_token', session.access_token);
      } else if (!token) {
        // Fallback or clear if stale
        sessionStorage.removeItem('admin_token');
        setToken(null);
      }
      setLoading(false);
    };
    checkSession();
  }, [token]);

  const handleLoginSuccess = (newToken: string) => {
    sessionStorage.setItem('admin_token', newToken);
    setToken(newToken);
  };

  const handleLogout = async () => {
    sessionStorage.removeItem('admin_token');
    setToken(null);
    try {
      const { supabase } = await import('../supabase');
      await supabase.auth.signOut();
    } catch(e) {}
  };

  if (loading) {
     return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-cyan"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  if (!token) {
    return <AdminLogin onSuccess={handleLoginSuccess} />;
  }

  const navItems = [
    { name: 'Telemetry', path: '/admin', icon: Activity, end: true },
    { name: 'Race Calendar', path: '/admin/calendar', icon: CalendarDays },
    { name: 'Media Pit', path: '/admin/media', icon: ImageIcon },
    { name: 'Videos', path: '/admin/videos', icon: Youtube },
    { name: 'Sponsors', path: '/admin/sponsors', icon: Globe },
    { name: 'Achievements', path: '/admin/timeline', icon: History },
    { name: 'Access Control', path: '/admin/access', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#f3f4f6] font-sans flex flex-col md:flex-row shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 glass-card md:rounded-none md:border-y-0 md:border-l-0 border-r border-white/10 md:min-h-screen p-6 flex flex-col z-20 shrink-0">
        <div className="mb-10 flex justify-between items-start">
          <div>
            <h1 className="display-text text-2xl font-black italic">
              THE <span className="neon-cyan-text">PADDOCK</span>
            </h1>
            <p className="text-gray-500 text-xs font-mono uppercase tracking-widest mt-2">Admin Control</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg uppercase text-xs font-bold tracking-widest transition-all duration-300 skew-velocity ${
                  isActive 
                    ? 'bg-cyan/10 text-cyan border border-cyan/30 glow-cyan' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`
              }
            >
              <item.icon className="w-4 h-4 unskew-velocity" />
              <span className="unskew-velocity">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-white/10 space-y-3">
          <Link 
            to="/"
            target="_blank"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--theme-text)] text-[var(--theme-bg)] rounded-lg uppercase text-xs font-bold tracking-widest transition-all duration-300 hover:opacity-80 skew-velocity"
          >
            <Globe className="w-4 h-4 unskew-velocity" />
            <span className="unskew-velocity">Live Preview</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 glass-card text-red-500 hover:bg-red-500 hover:text-black border border-white/10 hover:border-red-500 rounded-lg uppercase text-xs font-bold tracking-widest transition-all duration-300 skew-velocity"
          >
            <LogOut className="w-4 h-4 unskew-velocity" />
            <span className="unskew-velocity">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto relative noise-bg">
          <div className="flex-1 p-8 h-[calc(100vh-64px)] overflow-y-auto">
            <Routes>
              <Route index element={<Telemetry />} />
              <Route path="calendar" element={<RaceCalendar />} />
              <Route path="media" element={<MediaPit />} />
              <Route path="videos" element={<VideoManager />} />
              <Route path="sponsors" element={<SponsorManager />} />
              <Route path="timeline" element={<Achievements />} />
              <Route path="access" element={<AdminManager />} />
            </Routes>
          </div>
      </main>
    </div>
  );
}
