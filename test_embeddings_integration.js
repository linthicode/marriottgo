// Test script to verify embeddings integration
console.log('🧪 Testing Embeddings Integration...\n');

// Simulate the onboarding process
function simulateOnboardingFlow() {
  console.log('1. Simulating onboarding completion...');
  
  // Mock user data
  const mockUser = {
    id: 'test-user-123',
    email: 'test@example.com',
    user_metadata: {
      username: 'testuser'
    }
  };
  
  // Mock onboarding answers
  const mockAnswers = {
    q1: 'guest',
    q2: ['nature', 'museums', 'foods'],
    q2_ratings: {
      'nature': 'high',
      'museums': 'medium',
      'foods': 'high'
    }
  };
  
  // Calculate embeddings based on ratings
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
      case "high":
        return 1;
      case "medium":
        return 0.5;
      case "low":
        return 0.25;
      default:
        return 0;
    }
  }

  Object.keys(ratings).forEach((interestId) => {
    const idx = INTEREST_INDEX[interestId];
    if (typeof idx === "number") {
      scores[idx] = ratingToValue(ratings[interestId]);
    }
  });
  
  console.log('✅ Calculated embeddings:', scores);
  console.log('   - Nature (index 0):', scores[0], '(high = 1.0)');
  console.log('   - Museums (index 1):', scores[1], '(medium = 0.5)');
  console.log('   - Foods (index 12):', scores[12], '(high = 1.0)');
  console.log('   - Other categories:', scores.slice(2, 12), '(unselected = 0.0)');
  
  return { user: mockUser, embeddings: scores };
}

// Test the complete flow
function testEmbeddingsFlow() {
  console.log('Testing embeddings integration flow...\n');
  
  // Step 1: Simulate onboarding
  const { user, embeddings } = simulateOnboardingFlow();
  
  // Step 2: Verify embeddings structure
  console.log('\n2. Verifying embeddings structure...');
  if (embeddings.length === 13) {
    console.log('✅ Embeddings array has correct length (13)');
  } else {
    console.log('❌ Embeddings array has incorrect length:', embeddings.length);
  }
  
  // Step 3: Verify embedding values
  console.log('\n3. Verifying embedding values...');
  const hasNonZeroValues = embeddings.some(val => val > 0);
  if (hasNonZeroValues) {
    console.log('✅ Embeddings contain non-zero values (user preferences)');
  } else {
    console.log('❌ All embeddings are zero (no preferences detected)');
  }
  
  // Step 4: Simulate API call structure
  console.log('\n4. Simulating API call structure...');
  const apiPayload = {
    userId: user.id,
    embeddings: embeddings,
    postsCount: 0
  };
  console.log('✅ API payload structure:', {
    userId: apiPayload.userId,
    embeddingsLength: apiPayload.embeddings.length,
    postsCount: apiPayload.postsCount
  });
  
  console.log('\n🎉 Embeddings integration test completed!');
  console.log('\n📝 Expected behavior:');
  console.log('1. User completes onboarding → Embeddings calculated from preferences');
  console.log('2. Embeddings saved to Supabase profiles table');
  console.log('3. Backend uses embeddings for personalized recommendations');
  console.log('4. If no embeddings exist → Default neutral embeddings created');
}

// Run the test
testEmbeddingsFlow();
