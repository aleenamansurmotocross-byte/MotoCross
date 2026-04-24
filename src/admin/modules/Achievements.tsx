import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Save, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp, Achievement } from '../../context/AppContext';
import { supabase } from '../../supabase';

export function Achievements() {
  const { achievements, setAchievements } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAdd = async () => {
    const id = Math.random().toString(36).substr(2, 9);
    const newItem = {
      id,
      year: new Date().getFullYear().toString(),
      rank: '',
      eventName: '',
      category: '',
    };
    await supabase.from('achievements').insert(newItem);
    setEditingId(newItem.id);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('achievements').delete().eq('id', id);
    toast.error('Achievement removed from Chronicle');
  };

  const handleSave = (id: string) => {
    setEditingId(null);
    toast.success('Chronicle entry saved', { icon: '🏆' });
  };

  const updateItem = async (id: string, field: keyof Achievement, value: string) => {
    await supabase.from('achievements').update({ [field]: value }).eq('id', id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <h2 className="display-text text-3xl font-black italic mb-2">Chronicle <span className="neon-cyan-text">Editor</span></h2>
          <p className="text-gray-400 font-mono text-sm">Log new podiums, titles, and milestones.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="btn-primary group"
        >
            <Plus className="w-4 h-4" /> Add Record
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {achievements.map((item) => {
            const isEditing = editingId === item.id;
            
            return (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`glass-card p-6 border-l-4 transition-all duration-300 ${isEditing ? 'border-cyan glow-cyan' : 'border-white/20 hover:border-white/40'}`}
              >
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <input 
                      type="text" 
                      placeholder="Year (e.g., 2025)"
                      value={item.year}
                      onChange={(e) => updateItem(item.id, 'year', e.target.value)}
                      className="bg-black/50 border border-white/10 rounded px-3 py-2 text-sm font-mono focus:border-cyan outline-none"
                    />
                    <input 
                      type="text" 
                      placeholder="Rank (e.g., 1st Place)"
                      value={item.rank}
                      onChange={(e) => updateItem(item.id, 'rank', e.target.value)}
                      className="bg-black/50 border border-white/10 rounded px-3 py-2 text-sm focus:border-cyan outline-none font-bold"
                    />
                    <input 
                      type="text" 
                      placeholder="Event Name"
                      value={item.eventName}
                      onChange={(e) => updateItem(item.id, 'eventName', e.target.value)}
                      className="bg-black/50 border border-white/10 rounded px-3 py-2 text-sm focus:border-cyan outline-none lg:col-span-2"
                    />
                    <input 
                      type="text" 
                      placeholder="Category"
                      value={item.category}
                      onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                      className="bg-black/50 border border-white/10 rounded px-3 py-2 text-sm focus:border-cyan outline-none"
                    />
                    
                    <div className="lg:col-span-5 flex justify-end gap-2 mt-2">
                      <button 
                        onClick={() => handleSave(item.id)}
                        className="bg-white/10 hover:bg-cyan hover:text-black border border-white/20 hover:border-cyan text-white px-4 py-2 rounded text-xs font-bold uppercase transition-colors flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" /> Save Entry
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full border border-white/20 bg-black/50 text-cyan">
                        <Trophy className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-neon-orange text-sm font-bold">{item.year}</span>
                          <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-bold">{item.category}</span>
                        </div>
                        <h3 className="text-xl font-bold uppercase display-text tracking-tight flex items-center gap-2">
                          {item.eventName} 
                          <span className="text-gray-500 font-sans text-sm capitalize font-normal italic">
                            — {item.rank}
                          </span>
                        </h3>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setEditingId(item.id)}
                        className="text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-white px-3 py-2 transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:bg-red-500/10 p-2 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
