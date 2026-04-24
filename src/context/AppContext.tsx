import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../supabase';

// Shared Types
export type StatsData = { experience: number; wins: number; podiums: number; races: number };
export type RaceEvent = { id: string; name: string; location: string; date: string; status: 'Confirmed' | 'TBD'; image_url?: string };
export type Achievement = { id: string; year: string; rank: string; eventName: string; category: string };
export type MediaFile = { id: string; url: string; file?: File; progress: number; featured: boolean; tag: string; type?: 'image' | 'video' };
export type Sponsor = { id: string; name?: string; logo: string; link?: string; created_at?: string };

interface AppContextType {
  stats: StatsData;
  setStats: (stats: StatsData) => void;
  races: RaceEvent[];
  setRaces: React.Dispatch<React.SetStateAction<RaceEvent[]>>;
  achievements: Achievement[];
  setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>;
  media: MediaFile[];
  setMedia: React.Dispatch<React.SetStateAction<MediaFile[]>>;
  sponsors: Sponsor[];
  setSponsors: React.Dispatch<React.SetStateAction<Sponsor[]>>;
}

const defaultStats: StatsData = { experience: 7, wins: 18, podiums: 65, races: 83 };

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to sort custom date strings like "11th April", "03rd May", etc.
const parseRaceDate = (dateStr: string) => {
  if (!dateStr) return 9999;
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const lowerStr = dateStr.toLowerCase();
  const monthIdx = months.findIndex(m => lowerStr.includes(m));
  
  if (monthIdx === -1) return 9999;
  
  const dayMatch = dateStr.match(/\d+/);
  const day = dayMatch ? parseInt(dayMatch[0], 10) : 0;
  
  // Creates a sortable number, e.g. April 11 -> 311, May 3 -> 403
  return monthIdx * 100 + day;
};

const sortRaces = (races: RaceEvent[]) => {
  return [...races].sort((a, b) => parseRaceDate(a.date) - parseRaceDate(b.date));
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [stats, setStatsState] = useState<StatsData>(defaultStats);
  const [races, setRaces] = useState<RaceEvent[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    // Initial Fetches
    const fetchAll = async () => {
      const [{ data: statsData }, { data: racesData }, { data: achData }, { data: mediaData }, { data: sponsorsData }] = await Promise.all([
        supabase.from('site_stats').select('*').single(),
        supabase.from('races').select('*'),
        supabase.from('achievements').select('*').order('year', { ascending: false }),
        supabase.from('media').select('*').order('created_at', { ascending: false }),
        supabase.from('sponsors').select('*').order('created_at', { ascending: true })
      ]);

      if (statsData) setStatsState(statsData as StatsData);
      if (racesData) setRaces(sortRaces(racesData as RaceEvent[]));
      if (achData) setAchievements(achData as Achievement[]);
      if (mediaData) setMedia(mediaData.map(m => ({ ...m, progress: 100 })) as MediaFile[]);
      if (sponsorsData) setSponsors(sponsorsData as Sponsor[]);
    };

    fetchAll();

    // Supabase Realtime Subscriptions
    const statsSub = supabase.channel('stats-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_stats' }, payload => {
        setStatsState(payload.new as StatsData);
      }).subscribe();

    const racesSub = supabase.channel('races-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'races' }, () => {
        supabase.from('races').select('*').then(({ data }) => {
          if (data) setRaces(sortRaces(data as RaceEvent[]));
        });
      }).subscribe();

    const achSub = supabase.channel('achievements-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'achievements' }, () => {
        supabase.from('achievements').select('*').order('year', { ascending: false }).then(({ data }) => {
          if (data) setAchievements(data as Achievement[]);
        });
      }).subscribe();

    const mediaSub = supabase.channel('media-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'media' }, () => {
        supabase.from('media').select('*').order('created_at', { ascending: false }).then(({ data }) => {
          if (data) setMedia(data.map(m => ({ ...m, progress: 100 })) as MediaFile[]);
        });
      }).subscribe();

    const sponsorsSub = supabase.channel('sponsors-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sponsors' }, () => {
        supabase.from('sponsors').select('*').order('created_at', { ascending: true }).then(({ data }) => {
          if (data) setSponsors(data as Sponsor[]);
        });
      }).subscribe();

    return () => {
      supabase.removeChannel(statsSub);
      supabase.removeChannel(racesSub);
      supabase.removeChannel(achSub);
      supabase.removeChannel(mediaSub);
      supabase.removeChannel(sponsorsSub);
    };
  }, []);

  const setStats = async (newStats: StatsData) => {
    // Optimistic update
    setStatsState(newStats);
    // Persist to Supabase. Assuming there's exactly 1 row with id = 1
    await supabase.from('site_stats').upsert({ id: 1, ...newStats });
  };

  return (
    <AppContext.Provider value={{ stats, setStats, races, setRaces, achievements, setAchievements, media, setMedia, sponsors, setSponsors }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
