import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Flag, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';

export function Telemetry() {
  const { stats, setStats } = useApp();
  
  // Local state for edits
  const [localStats, setLocalStats] = useState(stats);
  const [saving, setSaving] = useState(false);

  // Sync if global changes
  useEffect(() => {
    setLocalStats(stats);
  }, [stats]);

  const handleUpdate = () => {
    setSaving(true);
    // Simulate network request
    setTimeout(() => {
      setStats(localStats);
      setSaving(false);
      toast.success(
        <div className="flex items-center gap-2">
          <Flag className="w-4 h-4 text-cyan" />
          <span>Telemetry Synced Successfully</span>
        </div>
      );
    }, 800);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalStats(prev => ({ ...prev, [name]: Number(value) }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h2 className="display-text text-3xl font-black italic mb-2">Telemetry <span className="neon-cyan-text">Update</span></h2>
        <p className="text-gray-400 font-mono text-sm">Modify global statistics across the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Metric Cards */}
        {[
          { id: 'experience', label: 'Years Experience', value: localStats.experience },
          { id: 'wins', label: 'Career Wins', value: localStats.wins },
          { id: 'podiums', label: 'Podium Finishes', value: localStats.podiums },
          { id: 'races', label: 'Total Races', value: localStats.races },
        ].map((stat) => (
          <div key={stat.id} className="glass-card p-6 flex flex-col gap-4 border-l-4 border-l-cyan">
            <label htmlFor={stat.id} className="text-xs uppercase font-bold tracking-widest text-gray-500">
              {stat.label}
            </label>
            <input
              id={stat.id}
              name={stat.id}
              type="number"
              value={stat.value}
              onChange={handleChange}
              className="bg-transparent border-b border-white/10 text-5xl font-black font-mono text-white focus:outline-none focus:border-cyan focus:text-cyan transition-colors py-2"
            />
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-white/10 flex justify-end">
        <button
          onClick={handleUpdate}
          disabled={saving}
          className="btn-primary group disabled:opacity-50"
        >
            {saving ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            Global Update
        </button>
      </div>
    </motion.div>
  );
}
