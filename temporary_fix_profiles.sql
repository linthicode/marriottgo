-- TEMPORARY FIX: Disable RLS for profiles table
-- This is for testing only - NOT recommended for production
-- Run this SQL in your Supabase SQL editor

-- Disable RLS temporarily
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Grant all permissions
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON profiles TO service_role;
GRANT ALL ON profiles TO anon;

-- Verify the change
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- This should show rowsecurity = false
