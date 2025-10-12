// Debug script to test onboarding and profile creation
console.log('🔍 Debugging Onboarding Issues...\n');

// Test 1: Check if user data is being passed correctly
function testUserData() {
  console.log('1. Testing user data structure...');
  
  // Mock user data (what should be in localStorage)
  const mockUser = {
    id: 'test-user-123',
    email: 'test@example.com',
    user_metadata: {
      username: 'testuser'
    }
  };
  
  console.log('✅ Expected user structure:', mockUser);
  console.log('   - id:', mockUser.id);
  console.log('   - email:', mockUser.email);
  console.log('   - username:', mockUser.user_metadata?.username);
  
  return mockUser;
}

// Test 2: Check embeddings calculation
function testEmbeddingsCalculation() {
  console.log('\n2. Testing embeddings calculation...');
  
  // Mock answers from onboarding
  const mockAnswers = {
    q1: 'guest',
    q2: ['nature', 'museums', 'foods'],
    q2_ratings: {
      'nature': 'high',
      'museums': 'medium', 
      'foods': 'high'
    }
  };
  
  console.log('✅ Mock answers:', mockAnswers);
  
  // Calculate embeddings
  const INTEREST_INDEX = {
    "nature": 0,
    "museums": 1,
    "theatres_and_entertainments": 2,
    "urban_environment": 3,
    "historic": 4,
    "religion": 5,
    "architecture": 6,
    "industrial_facilities": 7,
    "amusements": 8,
    "sport": 9,
    "adult": 10,
    "shops": 11,
    "foods": 12,
  };
  
  const scores = new Array(13).fill(0);
  const ratings = mockAnswers.q2_ratings || {};

  function ratingToValue(r) {
    switch ((r || "").toLowerCase()) {
      case "high": return 1;
      case "medium": return 0.5;
      case "low": return 0.25;
      default: return 0;
    }
  }

  Object.keys(ratings).forEach((interestId) => {
    const idx = INTEREST_INDEX[interestId];
    if (typeof idx === "number") {
      scores[idx] = ratingToValue(ratings[interestId]);
    }
  });
  
  console.log('✅ Calculated embeddings:', scores);
  console.log('   - Length:', scores.length);
  console.log('   - Non-zero values:', scores.filter(v => v > 0).length);
  
  return scores;
}

// Test 3: Check API payload structure
function testAPIPayload() {
  console.log('\n3. Testing API payload structure...');
  
  const user = testUserData();
  const embeddings = testEmbeddingsCalculation();
  
  const apiPayload = {
    id: user.id,
    embeddings: embeddings,
    posts: 0
  };
  
  console.log('✅ API payload:', apiPayload);
  console.log('   - User ID type:', typeof apiPayload.id);
  console.log('   - Embeddings type:', Array.isArray(apiPayload.embeddings));
  console.log('   - Embeddings length:', apiPayload.embeddings.length);
  
  return apiPayload;
}

// Test 4: Common issues checklist
function checkCommonIssues() {
  console.log('\n4. Common issues checklist...');
  
  const issues = [
    {
      issue: 'User ID is null/undefined',
      check: 'Check if user.id exists in localStorage',
      solution: 'Verify user is properly stored after signup'
    },
    {
      issue: 'Embeddings array is empty or wrong length',
      check: 'Check if q2_ratings are being captured',
      solution: 'Verify interest ratings are being saved'
    },
    {
      issue: 'Supabase connection failed',
      check: 'Check browser console for network errors',
      solution: 'Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
    },
    {
      issue: 'RLS policies blocking insert',
      check: 'Check Supabase logs for permission errors',
      solution: 'Verify RLS policies allow user to insert their own profile'
    },
    {
      issue: 'Table doesn\'t exist',
      check: 'Check if profiles table was created',
      solution: 'Run the SQL schema in Supabase'
    }
  ];
  
  issues.forEach((item, index) => {
    console.log(`${index + 1}. ${item.issue}`);
    console.log(`   Check: ${item.check}`);
    console.log(`   Solution: ${item.solution}\n`);
  });
}

// Test 5: Debug steps for browser
function browserDebugSteps() {
  console.log('\n5. Browser debugging steps...');
  
  console.log('Open browser console and run these commands:');
  console.log('');
  console.log('// Check user data in localStorage');
  console.log('const user = JSON.parse(localStorage.getItem("mm_current_user"));');
  console.log('console.log("User:", user);');
  console.log('console.log("User ID:", user?.id);');
  console.log('');
  console.log('// Check onboarding answers');
  console.log('const answers = JSON.parse(localStorage.getItem("mm_onboarding_result:" + user.id));');
  console.log('console.log("Answers:", answers);');
  console.log('');
  console.log('// Check Supabase connection');
  console.log('console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);');
  console.log('console.log("Supabase Key:", import.meta.env.VITE_SUPABASE_ANON_KEY);');
  console.log('');
  console.log('// Test profile creation manually');
  console.log('import { createOrUpdateProfile } from "./src/api/profiles.js";');
  console.log('const result = await createOrUpdateProfile(user.id, [1,0.5,0,0,0,0,0,0,0,0,0,0,1], 0);');
  console.log('console.log("Profile creation result:", result);');
}

// Run all tests
function runDebugTests() {
  console.log('Running comprehensive debugging tests...\n');
  
  testUserData();
  testEmbeddingsCalculation();
  testAPIPayload();
  checkCommonIssues();
  browserDebugSteps();
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Check browser console for errors during onboarding');
  console.log('2. Verify Supabase environment variables are set');
  console.log('3. Confirm profiles table exists in Supabase');
  console.log('4. Test profile creation manually in browser console');
  console.log('5. Check Supabase logs for any permission errors');
}

runDebugTests();
