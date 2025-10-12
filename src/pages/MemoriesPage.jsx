import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';
import Sidebar from '../components/Sidebar';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';

const KEY = "mm_posts_v1";

export default function MemoriesPage() {
  const { user } = useContext(AuthContext);
  const [experiences, setExperiences] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [filterYear, setFilterYear] = useState('all');

  useEffect(() => {
    // Load experiences from localStorage
    try {
      const stored = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(stored)) {
        setExperiences(stored);
      }
    } catch {
      setExperiences([]);
    }
  }, []);

  // Get unique years from experiences
  const years = [...new Set(experiences.map(exp => {
    const date = new Date(exp.createdAt || Date.now());
    return date.getFullYear();
  }))].sort((a, b) => b - a);

  // Filter and sort experiences
  const filteredExperiences = experiences
    .filter(exp => {
      if (filterYear === 'all') return true;
      const date = new Date(exp.createdAt || Date.now());
      return date.getFullYear() === parseInt(filterYear);
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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getMonthYear = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Group experiences by month
  const groupedExperiences = filteredExperiences.reduce((groups, exp) => {
    const monthYear = getMonthYear(exp.createdAt || Date.now());
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(exp);
    return groups;
  }, {});

  const totalExperiences = experiences.length;
  const totalCountries = new Set(experiences.map(exp => {
    // Extract country from address if available
    const address = exp.address || '';
    const parts = address.split(',');
    return parts[parts.length - 1]?.trim() || 'Unknown';
  })).size;
  const avgRating = experiences.length > 0 
    ? (experiences.reduce((sum, exp) => sum + (exp.rating || 0), 0) / experiences.length).toFixed(1)
    : 0;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className="flex-none sticky top-0 h-screen">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#a11d2b] to-[#8B1523] text-white py-8 px-8 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              <div>
                <h1 className="text-4xl font-bold">My Memories</h1>
                <p className="text-rose-100 text-base mt-1">Your journey through time</p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold">{totalExperiences}</div>
                <div className="text-rose-100 text-sm">Total Experiences</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold">{totalCountries}</div>
                <div className="text-rose-100 text-sm">Locations Visited</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl font-bold">{avgRating} ⭐</div>
                <div className="text-rose-100 text-sm">Average Rating</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Filters */}
          <div className="flex items-center justify-between mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <select 
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-xl text-gray-700 font-medium bg-white focus:outline-none focus:border-[#a11d2b] focus:ring-2 focus:ring-[#a11d2b]/20 transition-all"
                >
                  <option value="all">All Years</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-xl text-gray-700 font-medium bg-white focus:outline-none focus:border-[#a11d2b] focus:ring-2 focus:ring-[#a11d2b]/20 transition-all"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest-rated">Highest Rated</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <span className="font-semibold">{filteredExperiences.length}</span> experience(s) found
            </div>
          </div>

          {/* Timeline View */}
          {filteredExperiences.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              <h3 className="text-xl font-bold text-gray-600 mb-2">No memories yet</h3>
              <p className="text-gray-500 mb-6">Start creating experiences to build your memories!</p>
              <a
                href="/dashboard"
                className="inline-block bg-gradient-to-r from-[#a11d2b] to-[#8B1523] hover:from-[#8B1523] hover:to-[#a11d2b] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Go to Dashboard
              </a>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedExperiences).map(([monthYear, exps]) => (
                <div key={monthYear}>
                  {/* Month Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-r from-[#a11d2b] to-[#8B1523] text-white px-6 py-2 rounded-full shadow-md">
                      <h2 className="text-lg font-bold">{monthYear}</h2>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                  </div>

                  {/* Experiences List */}
                  <div className="space-y-4">
                    {exps.map((exp) => {
                      const photos = Array.isArray(exp.photos) ? exp.photos : exp.photos ? [exp.photos] : [];
                      const hasPhoto = photos.length > 0;
                      const displayUser = exp.user || user || null;
                      const userHandle = displayUser?.handle || displayUser?.user_metadata?.username || displayUser?.email || '';
                      const pfpImage = displayUser?.avatar || displayUser?.image || displayUser?.user_metadata?.avatar_url || displayUser?.user_metadata?.avatar || null;

                      return (
                        <div key={exp.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            {/* Image Section */}
                            {hasPhoto && (
                              <div className="md:w-1/3 relative">
                                <img
                                  src={photos[0]}
                                  alt={exp.experienceTitle || exp.hotelName}
                                  className="w-full h-full object-cover min-h-[200px]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                              </div>
                            )}

                            {/* Content Section */}
                            <div className={`flex-1 p-6 ${!hasPhoto ? 'md:w-full' : ''}`}>
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    {pfpImage ? (
                                      <img 
                                        src={pfpImage} 
                                        alt={userHandle} 
                                        className="w-10 h-10 rounded-full border-2 border-[#a11d2b]/20 object-cover shadow-md"
                                      />
                                    ) : (
                                      <Avatar 
                                        sx={{ 
                                          width: 40, 
                                          height: 40, 
                                          bgcolor: '#a11d2b',
                                          border: '2px solid rgba(161, 29, 43, 0.2)',
                                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                      >
                                        <PersonIcon sx={{ fontSize: 28 }} />
                                      </Avatar>
                                    )}
                                    <div>
                                      <h3 className="text-xl font-bold text-gray-900">
                                        {exp.experienceTitle || exp.hotelName || 'Experience'}
                                      </h3>
                                      <p className="text-sm text-gray-500">{formatDate(exp.createdAt || Date.now())}</p>
                                    </div>
                                  </div>

                                  {/* Location */}
                                  {exp.address && (
                                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                      </svg>
                                      <span className="text-sm">{exp.address}</span>
                                    </div>
                                  )}

                                  {/* Hotel */}
                                  {exp.hotelName && (
                                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                      </svg>
                                      <span className="text-sm font-medium">{exp.hotelName}</span>
                                    </div>
                                  )}

                                  {/* Description */}
                                  {exp.caption && (
                                    <p className="text-gray-700 mb-4 line-clamp-2">{exp.caption}</p>
                                  )}

                                  {/* Activity Tags */}
                                  {exp.activityTags && exp.activityTags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                      {exp.activityTags.map((tag, i) => (
                                        <span 
                                          key={tag + i} 
                                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#a11d2b]/10 text-[#a11d2b]"
                                        >
                                          #{String(tag).replace(/\s+/g, '')}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Rating Badge */}
                                {exp.rating > 0 && (
                                  <div className="flex items-center gap-1 bg-gradient-to-r from-[#a11d2b] to-[#8B1523] text-white px-4 py-2 rounded-full shadow-md">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="font-bold">{exp.rating}/5</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

