// src/api/posts.js
import supabase from '../helper/supabaseClient';

/**
 * Create a new post in the database
 * @param {Object} postData - The post data
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function createPost(postData) {
  try {
    const {
      user_id,
      hotel_id,
      hotel_name,
      hotel_address,
      experience_title,
      address,
      address_lat,
      address_lng,
      rating,
      activity_tags,
      caption,
      photos
    } = postData;

    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          user_id,
          hotel_id,
          hotel_name,
          hotel_address,
          experience_title,
          address,
          address_lat,
          address_lng,
          rating,
          activity_tags,
          caption,
          photos,
          likes: 0,
          comments: 0
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error creating post:', err);
    return { data: null, error: err };
  }
}

/**
 * Get all posts with user information
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export async function getPosts() {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        user:user_id (
          id,
          email,
          user_metadata
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error fetching posts:', err);
    return { data: null, error: err };
  }
}

/**
 * Get posts by user ID
 * @param {string} userId - The user ID
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export async function getPostsByUser(userId) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user posts:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error fetching user posts:', err);
    return { data: null, error: err };
  }
}

/**
 * Update a post
 * @param {string} postId - The post ID
 * @param {Object} updates - The fields to update
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function updatePost(postId, updates) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      console.error('Error updating post:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error updating post:', err);
    return { data: null, error: err };
  }
}

/**
 * Delete a post
 * @param {string} postId - The post ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function deletePost(postId) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error('Error deleting post:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error deleting post:', err);
    return { data: null, error: err };
  }
}