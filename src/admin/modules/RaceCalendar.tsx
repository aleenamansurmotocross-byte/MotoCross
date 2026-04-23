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
import { GripVertical, Plus, Trash2, CalendarX2, Image as ImageIcon, Loader2, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
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

// SortableItem component handles individual race rows with drag-and-drop capability and image uploading
function SortableItem({ id, race, onDelete, onUpdate, onImageUpload, onImageRemove }: { id: string, race: RaceEvent, onDelete: (id: string) => void, onUpdate: (id: string, field: keyof RaceEvent, value: string) => void, onImageUpload: (id: string, file: File) => Promise<void>, onImageRemove: (id: string) => Promise<void> }) {
  // Setup dnd-kit hooks for drag-and-drop
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const [isUploading, setIsUploading] = useState(false);

  // Dropzone handler for race image uploads
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setIsUploading(true);
    await onImageUpload(id, acceptedFiles[0]); // Trigger parent upload function
    setIsUploading(false);
  }, [id, onImageUpload]);

  // Configure react-dropzone instance
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'image/*': [] }, // Accept only images
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB limit
  });

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
      
      {/* Image Preview / Dropzone */}
      <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-black/50 border border-white/10 flex items-center justify-center group/img">
        {race.image_url ? (
          <>
            <img src={race.image_url} alt={race.name} className="w-full h-full object-cover opacity-80 group-hover/img:opacity-50 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/60">
              <button onClick={() => onImageRemove(id)} className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div {...getRootProps()} className={`w-full h-full flex items-center justify-center cursor-pointer transition-colors ${isDragActive ? 'bg-cyan/20' : 'hover:bg-white/10'}`}>
            <input {...getInputProps()} />
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin text-cyan" /> : <ImageIcon className={`w-5 h-5 ${isDragActive ? 'text-cyan' : 'text-gray-500'}`} />}
          </div>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center pl-2 pr-2">
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

  // Handles updating specific fields of a race event both in local state and Supabase DB
  const handleUpdate = async (id: string, field: keyof RaceEvent, value: string) => {
    // Quick UI Update immediately for responsive feel
    setRaces(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
    const { error } = await supabase.from('races').update({ [field]: value }).eq('id', id);
    if (error) {
      console.error("Supabase update error:", error);
      toast.error(`Database error: ${error.message}`);
      throw error;
    }
  };

  // Handles uploading a new image for a race event to the Supabase storage bucket
  const handleImageUpload = async (id: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      // Generate a unique filename using timestamp to prevent caching issues
      const fileName = `${id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('media').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);

      // Update UI and DB with the new public URL
      await handleUpdate(id, 'image_url', publicUrl);
      toast.success('Race image uploaded!');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    }
  };

  // Handles removing an image associated with a race event
  const handleImageRemove = async (id: string) => {
    try {
      const race = races.find(r => r.id === id);
      if (race?.image_url) {
        const urlParts = race.image_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        // Try to remove from storage, don't fail if it doesn't exist
        await supabase.storage.from('media').remove([fileName]).catch(() => {});
      }
      
      // Remove from UI and DB by setting to null
      setRaces(prev => prev.map(r => r.id === id ? { ...r, image_url: undefined } : r));
      await supabase.from('races').update({ image_url: null }).eq('id', id);
      toast.success('Race image removed');
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove image');
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
                <SortableItem key={race.id} id={race.id} race={race} onDelete={handleDelete} onUpdate={handleUpdate} onImageUpload={handleImageUpload} onImageRemove={handleImageRemove} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </motion.div>
  );
}
