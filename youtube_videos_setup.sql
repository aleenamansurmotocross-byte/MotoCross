-- Run this in your Supabase SQL Editor to create the youtube_videos table

CREATE TABLE IF NOT EXISTS public.youtube_videos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id text NOT NULL,
  title text,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.youtube_videos FOR SELECT USING (true);

-- Ensure authenticated users can modify
CREATE POLICY "Allow auth insert" ON public.youtube_videos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow auth update" ON public.youtube_videos FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow auth delete" ON public.youtube_videos FOR DELETE USING (auth.role() = 'authenticated');
