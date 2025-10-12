// Test Supabase connection and profile creation
// Run this in browser console to debug connection issues

console.log('🔍 Testing Supabase Connection...\n');

// Test 1: Check environment variables
console.log('1. Checking environment variables...');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set');

// Test 2: Check Supabase client
console.log('\n2. Testing Supabase client...');
try {
  const supabase = (await import('./src/helper/supabaseClient.js')).default;
  console.log('✅ Supabase client imported successfully');
  
  // Test connection
  const { data, error } = await supabase.from('profiles').select('count').limit(1);
  if (error) {
    console.error('❌ Supabase connection failed:', error);
  } else {
    console.log('✅ Supabase connection successful');
  }
} catch (err) {
  console.error('❌ Failed to import Supabase client:', err);
}

// Test 3: Test profile creation
console.log('\n3. Testing profile creation...');
try {
  const { createOrUpdateProfile } = await import('./src/api/profiles.js');
  
  const testUserId = 'test-user-' + Date.now();
  const testEmbeddings = [1.0, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1.0];
  
  console.log('Creating test profile with:', {
    userId: testUserId,
    embeddings: testEmbeddings
  });
  
  const result = await createOrUpdateProfile(testUserId, testEmbeddings, 0);
  
  if (result.error) {
    console.error('❌ Profile creation failed:', result.error);
  } else {
    console.log('✅ Profile creation successful:', result.data);
  }
} catch (err) {
  console.error('❌ Profile creation test failed:', err);
}

// Test 4: Check if profiles table exists
console.log('\n4. Checking profiles table...');
try {
  const supabase = (await import('./src/helper/supabaseClient.js')).default;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);
    
  if (error) {
    console.error('❌ Profiles table error:', error);
    console.log('💡 Solution: Run the SQL schema in Supabase to create the profiles table');
  } else {
    console.log('✅ Profiles table exists and accessible');
  }
} catch (err) {
  console.error('❌ Table check failed:', err);
}

console.log('\n🎯 Debugging complete!');
console.log('If you see errors above, check:');
console.log('1. Environment variables are set correctly');
console.log('2. Supabase project is active');
console.log('3. Profiles table exists (run the SQL schema)');
console.log('4. RLS policies allow profile creation');
