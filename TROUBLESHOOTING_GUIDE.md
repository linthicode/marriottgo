# Troubleshooting Guide: Username and Embeddings Not Saving

## Quick Diagnosis

### Step 1: Check Browser Console
Open your browser's developer console (F12) and look for these debug messages during onboarding:

```
=== ONBOARDING SUBMIT DEBUG ===
User: {id: "user-uuid", email: "user@example.com", ...}
Answers: {q1: "guest", q2: ["nature", "museums"], q2_ratings: {...}}
Interest ratings: {nature: "high", museums: "medium"}
Calculated embeddings: [1, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
User ID: user-uuid-here
Attempting to save profile to Supabase...
```

### Step 2: Check for Errors
Look for any red error messages in the console, especially:
- `Failed to save profile to Supabase:`
- `Supabase error creating/updating profile:`
- `No user ID found!`

## Common Issues and Solutions

### Issue 1: "No user ID found!"
**Symptoms**: Console shows "No user ID found! User: null"
**Cause**: User not properly stored in localStorage after signup
**Solution**: 
1. Check if user completed signup successfully
2. Verify localStorage contains `mm_current_user`
3. Try logging out and logging in again

### Issue 2: "Embeddings must be a 13-element array"
**Symptoms**: Console shows "Embeddings must be a 13-element array"
**Cause**: Interest ratings not being captured properly
**Solution**:
1. Ensure you complete the interest ratings question (q2_ratings)
2. Check that you select interests and rate them
3. Verify the ratings question appears after selecting interests

### Issue 3: "Supabase connection failed"
**Symptoms**: Network errors or "Failed to save profile to Supabase"
**Cause**: Supabase configuration issues
**Solution**:
1. Check environment variables in `.env` file:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
2. Verify Supabase project is active
3. Check Supabase dashboard for any service issues

### Issue 4: "Table doesn't exist"
**Symptoms**: "relation 'profiles' does not exist"
**Cause**: Profiles table not created in Supabase
**Solution**:
1. Go to Supabase SQL Editor
2. Run the SQL from `supabase_complete_schema.sql`
3. Verify table exists in Table Editor

### Issue 5: "Permission denied"
**Symptoms**: "new row violates row-level security policy"
**Cause**: RLS policies blocking profile creation
**Solution**:
1. Check RLS policies in Supabase
2. Ensure user is authenticated
3. Verify policies allow users to insert their own profiles

## Manual Testing Steps

### Test 1: Check User Data
Run in browser console:
```javascript
const user = JSON.parse(localStorage.getItem("mm_current_user"));
console.log("User:", user);
console.log("User ID:", user?.id);
```

### Test 2: Check Onboarding Answers
```javascript
const user = JSON.parse(localStorage.getItem("mm_current_user"));
const answers = JSON.parse(localStorage.getItem("mm_onboarding_result:" + user.id));
console.log("Answers:", answers);
```

### Test 3: Test Supabase Connection
```javascript
// Check environment variables
console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("Supabase Key:", import.meta.env.VITE_SUPABASE_ANON_KEY);

// Test connection
import { createOrUpdateProfile } from "./src/api/profiles.js";
const result = await createOrUpdateProfile("test-user", [1,0.5,0,0,0,0,0,0,0,0,0,0,1], 0);
console.log("Profile creation result:", result);
```

### Test 4: Check Database
1. Go to Supabase Table Editor
2. Look for `profiles` table
3. Check if any rows exist
4. Verify table structure matches schema

## Step-by-Step Debugging

### 1. Verify Database Setup
- [ ] Profiles table exists in Supabase
- [ ] RLS policies are configured
- [ ] User has proper permissions

### 2. Check Environment Variables
- [ ] VITE_SUPABASE_URL is set
- [ ] VITE_SUPABASE_ANON_KEY is set
- [ ] Values are correct (no typos)

### 3. Test User Flow
- [ ] User can sign up successfully
- [ ] User is redirected to onboarding
- [ ] User can answer all questions
- [ ] Interest ratings are captured

### 4. Check Console Logs
- [ ] No JavaScript errors
- [ ] Supabase connection successful
- [ ] Profile creation attempted
- [ ] Success/error messages clear

## Advanced Debugging

### Enable Detailed Logging
The updated code now includes comprehensive logging. Check console for:
- User data structure
- Answer capture
- Embedding calculation
- API call details
- Error specifics

### Check Supabase Logs
1. Go to Supabase Dashboard
2. Navigate to Logs
3. Look for any errors during profile creation
4. Check authentication logs

### Test API Directly
```javascript
// Test profile creation with known data
const testData = {
  id: "test-user-123",
  embeddings: [1, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  posts: 0
};

// Test with Supabase client directly
const { data, error } = await supabase
  .from('profiles')
  .upsert([testData])
  .select();
  
console.log("Direct test result:", { data, error });
```

## Prevention

### For Developers
1. Always test onboarding flow after changes
2. Monitor console logs during development
3. Verify database schema matches code expectations
4. Test with different user scenarios

### For Users
1. Complete all onboarding questions
2. Ensure stable internet connection
3. Don't refresh page during onboarding
4. Check for any error messages

## Getting Help

If issues persist:
1. Check browser console for specific error messages
2. Verify Supabase project status
3. Test with a fresh user account
4. Review this guide for your specific error

The enhanced debugging should now show exactly where the process is failing!
