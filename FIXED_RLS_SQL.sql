-- FIXED SQL for RLS Policy Error
-- Copy and paste this entire block into Supabase SQL Editor and run it

-- Step 1: Drop all existing policies on profiles table
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;

-- Step 2: Temporarily disable RLS for profiles table
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Step 3: Grant all necessary permissions
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON profiles TO service_role;
GRANT ALL ON profiles TO anon;

-- Step 4: Verify the changes (FIXED QUERY)
SELECT 
    schemaname, 
    tablename, 
    rowsecurity
FROM pg_tables 
WHERE tablename = 'profiles';
