// src/api/profiles.js
import supabase from '../helper/supabaseClient';

/**
 * Create or update user profile with embeddings
 * @param {string} userId - The user ID
 * @param {Array} embeddings - The user's preference embeddings (13-dimensional array)
 * @param {number} postsCount - Initial posts count (default 0)
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function createOrUpdateProfile(userId, embeddings, postsCount = 0) {
  try {
    // Debug logging
    console.log('Creating/updating profile with:', {
      userId,
      userIdType: typeof userId,
      embeddings,
      embeddingsLength: Array.isArray(embeddings) ? embeddings.length : 'not array',
      postsCount
    });

    // Validate inputs
    if (!userId) {
      console.error('User ID is required');
      return { data: null, error: new Error('User ID is required') };
    }

    if (!Array.isArray(embeddings) || embeddings.length !== 13) {
      console.error('Embeddings must be a 13-element array');
      return { data: null, error: new Error('Embeddings must be a 13-element array') };
    }

    // Check authentication status
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    console.log('Current authenticated user:', authUser);
    console.log('Auth error:', authError);

    if (authError || !authUser) {
      console.error('User not authenticated:', authError);
      return { data: null, error: new Error('User not authenticated') };
    }

    // Ensure user ID matches authenticated user
    if (authUser.id !== userId) {
      console.warn('User ID mismatch:', { authUserId: authUser.id, providedUserId: userId });
      // Use authenticated user's ID instead
      userId = authUser.id;
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert([
        {
          id: userId,
          embeddings: embeddings,
          posts: postsCount
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating/updating profile:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return { data: null, error };
    }

    console.log('Profile created/updated successfully:', data);
    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error creating/updating profile:', err);
    return { data: null, error: err };
  }
}

/**
 * Get user profile
 * @param {string} userId - The user ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function getProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error fetching profile:', err);
    return { data: null, error: err };
  }
}

/**
 * Update user embeddings
 * @param {string} userId - The user ID
 * @param {Array} embeddings - The updated embeddings
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function updateUserEmbeddings(userId, embeddings) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ embeddings: embeddings })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating embeddings:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error updating embeddings:', err);
    return { data: null, error: err };
  }
}
