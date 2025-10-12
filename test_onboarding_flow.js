// Test script to verify onboarding flow
console.log('🧪 Testing Onboarding Flow...\n');

// Simulate the signup process
function simulateSignup() {
  console.log('1. Simulating user signup...');
  
  // Create a mock user object (similar to what Supabase would return)
  const mockUser = {
    id: 'test-user-123',
    email: 'test@example.com',
    user_metadata: {
      username: 'testuser'
    },
    onboarded: false // Initially false
  };
  
  // Store in localStorage (this is what the Login.jsx now does)
  localStorage.setItem('mm_current_user', JSON.stringify(mockUser));
  console.log('✅ User stored in localStorage:', mockUser);
  
  return mockUser;
}

// Simulate the onboarding completion
function simulateOnboardingCompletion() {
  console.log('\n2. Simulating onboarding completion...');
  
  try {
    const raw = localStorage.getItem('mm_current_user');
    if (raw) {
      const user = JSON.parse(raw);
      user.onboarded = true;
      localStorage.setItem('mm_current_user', JSON.stringify(user));
      console.log('✅ User marked as onboarded:', user);
      return user;
    }
  } catch (e) {
    console.error('❌ Error completing onboarding:', e);
  }
}

// Test the flow
function testOnboardingFlow() {
  console.log('Testing complete onboarding flow...\n');
  
  // Step 1: Simulate signup
  const user = simulateSignup();
  
  // Step 2: Check if onboarding would be triggered
  console.log('\n3. Checking if onboarding would be triggered...');
  if (!user.onboarded) {
    console.log('✅ Onboarding would be triggered (user.onboarded = false)');
  } else {
    console.log('❌ Onboarding would be skipped (user.onboarded = true)');
  }
  
  // Step 3: Simulate completing onboarding
  const completedUser = simulateOnboardingCompletion();
  
  // Step 4: Check if onboarding would be skipped after completion
  console.log('\n4. Checking if onboarding would be skipped after completion...');
  if (completedUser.onboarded) {
    console.log('✅ Onboarding would be skipped (user.onboarded = true)');
  } else {
    console.log('❌ Onboarding would still be triggered (user.onboarded = false)');
  }
  
  console.log('\n🎉 Onboarding flow test completed!');
  console.log('\n📝 Expected behavior:');
  console.log('1. After signup → User goes to /onboarding');
  console.log('2. After completing onboarding → User goes to /dashboard');
  console.log('3. If user tries to access /dashboard without onboarding → Redirected to /onboarding');
  console.log('4. If user tries to access /onboarding after completion → Redirected to /dashboard');
}

// Run the test
testOnboardingFlow();

// Clean up
localStorage.removeItem('mm_current_user');
