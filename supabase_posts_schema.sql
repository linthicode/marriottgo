-- Create posts table for MarriottGo application
-- Run this SQL in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hotel_id TEXT NOT NULL,
  hotel_name TEXT NOT NULL,
  hotel_address TEXT,
  experience_title TEXT NOT NULL,
  address TEXT NOT NULL,
  address_lat DECIMAL(10, 8),
  address_lng DECIMAL(11, 8),
  rating INTEGER CHECK (rating >= 0 AND rating <= 5),
  activity_tags TEXT[] DEFAULT '{}',
  caption TEXT,
  photos TEXT[] DEFAULT '{}',
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_hotel_id ON posts(hotel_id);
CREATE INDEX IF NOT EXISTS idx_posts_rating ON posts(rating);

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Users can insert their own posts
CREATE POLICY "Users can insert their own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view all posts
CREATE POLICY "Users can view all posts" ON posts
  FOR SELECT USING (true);

-- Users can update their own posts
CREATE POLICY "Users can update their own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete their own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_posts_updated_at 
  BEFORE UPDATE ON posts 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON posts TO authenticated;
GRANT ALL ON posts TO service_role;
