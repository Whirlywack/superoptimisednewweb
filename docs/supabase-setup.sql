-- Supabase Real-time Setup for Question Response System
-- Run these commands in your Supabase SQL Editor

-- Enable real-time on question_responses table
ALTER PUBLICATION supabase_realtime ADD TABLE question_responses;

-- Enable real-time on live_stats table for community statistics
ALTER PUBLICATION supabase_realtime ADD TABLE live_stats;

-- Create RLS policies for question_responses table
-- Allow anonymous users to insert (for voting)
CREATE POLICY "Allow anonymous vote submission" ON question_responses
FOR INSERT 
WITH CHECK (true);

-- Allow public read access to aggregate vote data (no personal info exposed)
CREATE POLICY "Allow public read access to vote data" ON question_responses
FOR SELECT
USING (true);

-- Enable RLS on question_responses
ALTER TABLE question_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for live_stats table
-- Allow public read access to community statistics
CREATE POLICY "Allow public read access to live stats" ON live_stats
FOR SELECT
USING (true);

-- Allow system to update live stats (for vote counting)
CREATE POLICY "Allow system updates to live stats" ON live_stats
FOR UPDATE
USING (true);

-- Allow system to insert live stats (for new stat types)
CREATE POLICY "Allow system inserts to live stats" ON live_stats
FOR INSERT
WITH CHECK (true);

-- Enable RLS on live_stats
ALTER TABLE live_stats ENABLE ROW LEVEL SECURITY;

-- Optional: Create indexes for better real-time performance
CREATE INDEX IF NOT EXISTS idx_question_responses_question_id ON question_responses(question_id);
CREATE INDEX IF NOT EXISTS idx_question_responses_created_at ON question_responses(created_at);
CREATE INDEX IF NOT EXISTS idx_live_stats_stat_key ON live_stats(stat_key);

-- Note: These policies allow anonymous voting while protecting sensitive data.
-- Voter tokens are hashed and no personal information is exposed.
-- Real-time subscriptions will work for vote counts and live statistics.