# Supabase Database Setup Guide

This guide will help you set up the required database tables for the MarriottGo application.

## Prerequisites

- Supabase project created
- Access to Supabase SQL Editor
- Database credentials configured in your app

## Step-by-Step Setup

### 1. Access Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**

### 2. Run the Complete Schema

Copy and paste the contents of `supabase_complete_schema.sql` into the SQL editor and run it.

**OR** if you prefer to run tables separately:

#### Option A: Run Complete Schema (Recommended)
```sql
-- Copy the entire contents of supabase_complete_schema.sql
-- and paste it into the SQL editor, then click "Run"
```

#### Option B: Run Tables Separately

**First, run the profiles table:**
```sql
-- Copy contents of supabase_profiles_schema.sql
```

**Then, run the posts table (if not already created):**
```sql
-- Copy contents of supabase_posts_schema.sql
```

### 3. Verify Tables Created

Run this query to verify both tables exist:

```sql
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('posts', 'profiles');
```

You should see:
```
table_name | table_type
-----------|-----------
posts      | BASE TABLE
profiles   | BASE TABLE
```

### 4. Verify Table Structure

**Check profiles table structure:**
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;
```

Expected output:
```
column_name | data_type           | is_nullable
------------|-------------------|------------
id          | uuid              | NO
embeddings  | ARRAY             | NO
posts       | integer           | YES
created_at  | timestamp with time zone | YES
updated_at  | timestamp with time zone | YES
```

**Check posts table structure:**
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'posts' 
ORDER BY ordinal_position;
```

### 5. Test Insert (Optional)

Test that you can insert data into the profiles table:

```sql
-- Replace 'your-user-id' with an actual user ID from auth.users
INSERT INTO profiles (id, embeddings, posts) 
VALUES (
  'your-user-id-here',
  ARRAY[1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0],
  0
);
```

### 6. Verify RLS Policies

Check that Row Level Security is enabled:

```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('posts', 'profiles');
```

Both tables should show `rowsecurity = true`.

## Troubleshooting

### Common Issues

#### 1. "Table doesn't exist" Error
- **Cause**: SQL didn't execute properly
- **Solution**: Re-run the schema SQL and check for errors

#### 2. "Permission denied" Error
- **Cause**: RLS policies are too restrictive
- **Solution**: Check that you're authenticated and policies are correct

#### 3. "Foreign key constraint" Error
- **Cause**: Referenced user doesn't exist in auth.users
- **Solution**: Ensure user is properly authenticated

#### 4. "Array type mismatch" Error
- **Cause**: Embeddings array has wrong dimensions
- **Solution**: Ensure embeddings array has exactly 13 elements

### Debug Queries

**Check if tables exist:**
```sql
SELECT * FROM information_schema.tables 
WHERE table_schema = 'public';
```

**Check RLS policies:**
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('posts', 'profiles');
```

**Check table permissions:**
```sql
SELECT grantee, privilege_type 
FROM information_schema.table_privileges 
WHERE table_name IN ('posts', 'profiles');
```

## Verification Checklist

- [ ] Both `posts` and `profiles` tables created
- [ ] All indexes created successfully
- [ ] RLS enabled on both tables
- [ ] Policies created for both tables
- [ ] Triggers created for updated_at columns
- [ ] Permissions granted to authenticated users
- [ ] Test insert works (optional)

## Next Steps

After setting up the database:

1. **Test the application**: Try creating a user account
2. **Complete onboarding**: Answer the preference questions
3. **Check Supabase**: Verify embeddings are saved in profiles table
4. **Test recommendations**: Create a post and check for AI recommendations

## Support

If you encounter issues:

1. Check the Supabase logs in the dashboard
2. Verify your database connection settings
3. Ensure all SQL commands executed without errors
4. Test with a simple query first

The database setup is now complete and ready for the MarriottGo application!
