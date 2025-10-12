// Test script to verify Supabase posts integration
// Run this in your browser console after logging in

import { getPosts, createPost } from './src/api/posts.js';

// Test creating a post
const testPost = {
  user_id: 'your-user-id-here', // Replace with actual user ID
  hotel_id: '1',
  hotel_name: 'Test Hotel',
  hotel_address: '123 Test St, Test City',
  experience_title: 'Test Experience',
  address: '456 Experience Ave, Test City',
  address_lat: 40.7128,
  address_lng: -74.0060,
  rating: 5,
  activity_tags: ['nature', 'foods'],
  caption: 'This is a test post',
  photos: []
};

// Test creating a post
async function testCreatePost() {
  try {
    console.log('Testing post creation...');
    const { data, error } = await createPost(testPost);
    
    if (error) {
      console.error('Error creating post:', error);
    } else {
      console.log('Post created successfully:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Test fetching posts
async function testGetPosts() {
  try {
    console.log('Testing post fetching...');
    const { data, error } = await getPosts();
    
    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      console.log('Posts fetched successfully:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Run tests
console.log('Running Supabase posts integration tests...');
testCreatePost();
testGetPosts();
