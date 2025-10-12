// Test script to verify backend integration
const fetch = require('node-fetch');

const BACKEND_URL = 'http://localhost:5000';

async function testBackendIntegration() {
  console.log('🧪 Testing Backend Integration...\n');

  // Test 1: Health check
  console.log('1. Testing health check...');
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    const data = await response.json();
    console.log('✅ Health check passed:', data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }

  // Test 2: Test post-created endpoint (this would normally be called by frontend)
  console.log('\n2. Testing post-created endpoint...');
  try {
    const testPostId = 'test-post-123';
    const response = await fetch(`${BACKEND_URL}/events/post-created`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post_id: testPostId
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Post-created endpoint responded:', data);
    } else {
      console.log('❌ Post-created endpoint failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Post-created endpoint error:', error.message);
  }

  // Test 3: Test recommendations endpoint
  console.log('\n3. Testing recommendations endpoint...');
  try {
    const testPostId = 'test-post-123';
    const response = await fetch(`${BACKEND_URL}/api/recs/from-post/${testPostId}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Recommendations endpoint responded:', data);
    } else {
      console.log('❌ Recommendations endpoint failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Recommendations endpoint error:', error.message);
  }

  console.log('\n🎉 Backend integration test completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Start the backend server: cd backend && python Main.py');
  console.log('2. Start the frontend: npm run dev');
  console.log('3. Create a post in the frontend to test the full flow');
}

// Run the test
testBackendIntegration().catch(console.error);
