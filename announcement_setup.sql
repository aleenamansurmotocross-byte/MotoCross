-- Create the announcement table
CREATE TABLE IF NOT EXISTS announcement (
  id INT PRIMARY KEY DEFAULT 1,
  is_active BOOLEAN DEFAULT false,
  title TEXT NOT NULL,
  button_text TEXT,
  button_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert a default row if it doesn't exist
INSERT INTO announcement (id, is_active, title, button_text, button_link)
VALUES (1, false, 'New Interview Out Now!', 'Watch Now', 'https://youtube.com')
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE announcement ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON announcement
  FOR SELECT USING (true);

-- Create policy to allow authenticated admin updates
CREATE POLICY "Allow authenticated admin updates" ON announcement
  FOR ALL USING (auth.role() = 'authenticated');

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE announcement;
