-- Complete Supabase schema for MarriottGo application
-- Run this SQL in your Supabase SQL editor

-- ==============================================
-- POSTS TABLE
-- ==============================================

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

-- ==============================================
-- PROFILES TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  embeddings FLOAT[] NOT NULL DEFAULT '{}',
  posts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- INDEXES FOR PERFORMANCE
-- ==============================================

-- Posts indexes
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_hotel_id ON posts(hotel_id);
CREATE INDEX IF NOT EXISTS idx_posts_rating ON posts(rating);

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_embeddings ON profiles USING GIN (embeddings);
CREATE INDEX IF NOT EXISTS idx_profiles_posts ON profiles(posts);

-- ==============================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================

-- Enable RLS on both tables
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Posts policies
CREATE POLICY "Users can insert their own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all posts" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);

-- Profiles policies
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete their own profile" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- ==============================================
-- TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- ==============================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for both tables
CREATE TRIGGER update_posts_updated_at 
  BEFORE UPDATE ON posts 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- PERMISSIONS
-- ==============================================

-- Grant permissions for posts
GRANT ALL ON posts TO authenticated;
GRANT ALL ON posts TO service_role;

-- Grant permissions for profiles
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON profiles TO service_role;

-- ==============================================
-- SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ==============================================

-- Uncomment the following lines to insert sample data for testing
-- INSERT INTO profiles (id, embeddings, posts) 
-- VALUES (
--   'your-user-id-here',
--   ARRAY[1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0],
--   0
-- );
