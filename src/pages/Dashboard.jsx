import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import ModalPost from "../components/ModalPost";

const KEY = "mm_posts_v1";

export default function Dashboard() {
  const [showPostModal, setShowPostModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [posts, setPosts] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(KEY) || "null");
      if (Array.isArray(stored)) return stored;
    } catch {}

    // default sample post (you can replace image files in public/images/)
    return [];
  });

  // Filter states
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highest-rated

  // Available activity filters
  const activityFilters = [
    'nature', 'museums', 'theatres_and_entertainments', 'urban_environment',
    'historic', 'religion', 'architecture', 'industrial_facilities',
    'amusements', 'sport', 'adult', 'shops', 'foods'
  ];

  // Toggle activity filter
  const toggleActivity = (activity) => {
    setSelectedActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedActivities([]);
    setSelectedRating(0);
    setSortBy('newest');
  };

  // Filter and sort posts
  const filteredPosts = posts
    .filter(post => {
      // Filter by activities
      if (selectedActivities.length > 0) {
        const postActivities = post.activityTags || [];
        const hasMatchingActivity = selectedActivities.some(selected => 
          postActivities.some(tag => 
            String(tag).toLowerCase().replace(/\s+/g, '_') === selected
          )
        );
        if (!hasMatchingActivity) return false;
      }
      
      // Filter by rating
      if (selectedRating > 0) {
        const postRating = post.rating || 0;
        if (postRating < selectedRating) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return (b.createdAt || 0) - (a.createdAt || 0);
      } else if (sortBy === 'oldest') {
        return (a.createdAt || 0) - (b.createdAt || 0);
      } else if (sortBy === 'highest-rated') {
        return (b.rating || 0) - (a.rating || 0);
      }
      return 0;
    });

   function handleCreate(post) {
    setPosts((prev) => {
      const next = [post, ...prev];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
    setShowPostModal(false);
  }

  function handleReset() {
    if (!confirm("Reset posts to default sample? This will clear saved posts.")) return;
    localStorage.removeItem(KEY);
    // reset to the same initial sample used above
    const sample = [];
    setPosts(sample);
  }
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar stays a fixed width and is sticky */}
      <div className="flex-none sticky top-0 h-screen">
        <Sidebar onOpenPost={() => setShowPostModal(true)} />
      </div>

      {/* Main content scrolls independently */}
      <div className="flex-1 overflow-auto max-h-screen">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-[#a11d2b] to-[#8B1523] text-white py-4 px-8 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-1">Travel Experiences</h1>
            <p className="text-rose-100 text-base">Discover amazing journeys from our community</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all border-2 ${
                  showFilters 
                    ? 'bg-[#a11d2b] text-white border-[#a11d2b]' 
                    : 'bg-white text-gray-700 border-gray-200'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="font-medium">Filter</span>
                {(selectedActivities.length > 0 || selectedRating > 0) && (
                  <span className="bg-white text-[#a11d2b] text-xs font-bold px-2 py-0.5 rounded-full">
                    {selectedActivities.length + (selectedRating > 0 ? 1 : 0)}
                  </span>
                )}
                <svg 
                  className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-gray-700 font-medium bg-transparent border-none focus:outline-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest-rated">Highest Rated</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Posts
            </button>
          </div>

          {/* Expandable Filter Panel */}
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showFilters ? 'max-h-[1000px] opacity-100 mb-6' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#a11d2b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  Filter Options
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#a11d2b] hover:text-[#8B1523] font-semibold flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear All
                </button>
              </div>

              {/* Activity Tags Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Activities
                </label>
                <div className="flex flex-wrap gap-2">
                  {activityFilters.map(activity => (
                    <button
                      key={activity}
                      onClick={() => toggleActivity(activity)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedActivities.includes(activity)
                          ? 'bg-gradient-to-r from-[#a11d2b] to-[#8B1523] text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      #{activity.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Minimum Rating
                </label>
                <div className="flex items-center gap-2">
                  {[0, 1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(rating)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        selectedRating === rating
                          ? 'bg-gradient-to-r from-[#a11d2b] to-[#8B1523] text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {rating === 0 ? 'Any' : `${rating}+ ⭐`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Filters Summary */}
              {(selectedActivities.length > 0 || selectedRating > 0) && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">{filteredPosts.length}</span> experience(s) match your filters
                  </p>
                </div>
              )}
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-xl font-bold text-gray-600 mb-2">No posts yet</h3>
              <p className="text-gray-500 mb-6">Be the first to share your travel experience!</p>
              <button
                onClick={() => setShowPostModal(true)}
                className="bg-gradient-to-r from-[#a11d2b] to-[#8B1523] hover:from-[#8B1523] hover:to-[#a11d2b] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Add Your First Experience
              </button>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-600 mb-2">No posts match your filters</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters to see more results</p>
              <button
                onClick={clearFilters}
                className="bg-gradient-to-r from-[#a11d2b] to-[#8B1523] hover:from-[#8B1523] hover:to-[#a11d2b] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredPosts.map((p) => <PostCard key={p.id} post={p} />)
          )}
        </div>
      </div>

      {showPostModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-3xl">
            <ModalPost onCancel={() => setShowPostModal(false)} onCreate={handleCreate} />
          </div>
        </div>
      )}
    </div>
  );
}
