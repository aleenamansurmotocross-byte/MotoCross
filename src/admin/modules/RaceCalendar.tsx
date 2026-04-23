import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';
import { GripVertical, Plus, Trash2, CalendarX2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp, RaceEvent } from '../../context/AppContext';
import { supabase } from '../../supabase';

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
    status === 'Confirmed' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 
    'bg-zinc-800 text-zinc-500 border border-zinc-700'
  }`}>
    {status}
  </span>
);

function SortableItem({ id, race, onDelete, onUpdate }: { id: string, race: RaceEvent, onDelete: (id: string) => void, onUpdate: (id: string, field: keyof RaceEvent, value: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`glass-card p-4 flex items-center gap-4 border-l-4 ${isDragging ? 'opacity-50 border-cyan' : 'border-white/20'}`}>
      <div {...attributes} {...listeners} className="cursor-grab hover:text-cyan text-gray-500 px-2">
        <GripVertical className="w-5 h-5" />
      </div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center pr-2">
        <div className="col-span-2 space-y-1">
          <input 
            type="text" 
            value={race.name}
            onChange={(e) => onUpdate(id, 'name', e.target.value)}
            placeholder="Race Name"
            className="font-bold text-sm tracking-tight bg-transparent border-b border-white/5 focus:border-cyan outline-none w-full text-white transition-colors" 
          />
          <input 
            type="text" 
            value={race.location}
            onChange={(e) => onUpdate(id, 'location', e.target.value)}
            placeholder="Location"
            className="text-xs text-gray-500 font-mono bg-transparent border-b border-white/5 focus:border-cyan outline-none w-full transition-colors" 
          />
        </div>
        <div>
          <input 
            type="text" 
            value={race.date}
            onChange={(e) => onUpdate(id, 'date', e.target.value)}
            placeholder="Date (e.g. 2025-10-15)"
            className="text-xs font-mono bg-transparent border-b border-white/5 focus:border-cyan outline-none w-full transition-colors" 
          />
        </div>
        <div className="flex justify-between items-center">
          <button 
            type="button" 
            onClick={() => onUpdate(id, 'status', race.status === 'Confirmed' ? 'TBD' : 'Confirmed')}
            className="hover:opacity-75 transition-opacity"
            title="Click to toggle status"
          >
            <StatusBadge status={race.status} />
          </button>
          <button 
            type="button" 
            onClick={() => onDelete(id)}
            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors z-10"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function RaceCalendar() {
  const { races, setRaces } = useApp();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: any) => {
    const {active, over} = event;
    if (active.id !== over.id) {
      const oldIndex = races.findIndex(i => i.id === active.id);
      const newIndex = races.findIndex(i => i.id === over.id);
      const newItems = arrayMove(races, oldIndex, newIndex);
      // Wait to re-order instantly in UI
      setRaces(newItems);
      // Upsert order to Supabase
      const updates = newItems.map((race, index) => ({ id: race.id, order: index, name: race.name, location: race.location, date: race.date, status: race.status }));
      await supabase.from('races').upsert(updates);
      toast.success("Race order updated!");
    }
  };

  const handleAddRace = async () => {
    const id = Math.random().toString(36).substr(2, 9);
    const newRace = {
      id,
      name: 'New Race Event',
      location: 'Location',
      date: 'TBD',
      status: 'TBD',
      order: races.length
    };
    await supabase.from('races').insert(newRace);
    toast.success("New race draft added");
  };

  const handleDelete = async (id: string) => {
    await supabase.from('races').delete().eq('id', id);
    toast.error("Race removed from calendar", { icon: '🗑️' });
  };

  const handleUpdate = async (id: string, field: keyof RaceEvent, value: string) => {
    // Quick UI Update immediately
    setRaces(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
    await supabase.from('races').update({ [field]: value }).eq('id', id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-end">
        <div>
          <h2 className="display-text text-3xl font-black italic mb-2">Race <span className="neon-cyan-text">Calendar</span></h2>
          <p className="text-gray-400 font-mono text-sm">Manage upcoming schedule. Drag to reorder priority.</p>
        </div>
        <button 
          onClick={handleAddRace}
          className="bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors skew-velocity"
        >
          <span className="unskew-velocity flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Event
          </span>
        </button>
      </div>

      {races.length === 0 ? (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center opacity-50 border-dashed">
          <CalendarX2 className="w-16 h-16 mb-4 text-gray-500" />
          <h3 className="text-lg font-bold uppercase tracking-widest">Quiet Track</h3>
          <p className="text-gray-500 font-mono text-xs mt-2">No upcoming races scheduled.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={races.map(r => r.id)}
              strategy={verticalListSortingStrategy}
            >
              {races.map(race => (
                <SortableItem key={race.id} id={race.id} race={race} onDelete={handleDelete} onUpdate={handleUpdate} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </motion.div>
  );
}
