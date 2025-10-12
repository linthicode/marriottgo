import React, { useContext, useState } from 'react';
import { AuthContext } from '../auth/AuthProvider';
import Sidebar from '../components/Sidebar';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import EditProfileModal from '../components/profile/EditProfileModal';

export default function ProfilePage() {
  const { user } = useContext(AuthContext);
  
  const username = user?.user_metadata?.username || user?.email || 'Guest User';
  const avatar = user?.user_metadata?.avatar_url;
  const email = user?.email || 'user@example.com';
  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'January 2024';

  // Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editUsername, setEditUsername] = useState(username);
  const [editBio, setEditBio] = useState('Travel enthusiast | Hotel reviewer | Adventure seeker 🌍');
  const [editLocation, setEditLocation] = useState('New York, USA');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleOpenEditModal = () => {
    setEditUsername(username);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const handleSaveProfile = () => {
    // Here you would typically save to Supabase
    // For now, just show success message
    setSnackbarMessage('Profile updated successfully!');
    setShowSnackbar(true);
    setEditModalOpen(false);
  };

  // Dummy statistics
  const stats = [
    { label: 'Posts', value: '24', icon: '📝', color: 'from-blue-500 to-blue-600' },
    { label: 'Followers', value: '1.2K', icon: '👥', color: 'from-purple-500 to-purple-600' },
    { label: 'Following', value: '342', icon: '🔔', color: 'from-pink-500 to-pink-600' },
    { label: 'Likes', value: '3.4K', icon: '❤️', color: 'from-red-500 to-red-600' },
  ];

  const activityStats = [
    { label: 'Hotels Visited', value: '12', change: '+3 this month' },
    { label: 'Countries', value: '8', change: '+2 this year' },
    { label: 'Avg Rating', value: '4.8', change: '⭐ Excellent' },
    { label: 'Total Miles', value: '45K', change: 'Platinum Status' },
  ];

  const recentActivities = [
    { action: 'Posted a new experience', location: 'Marriott Marquis NYC', time: '2 hours ago', icon: '📸' },
    { action: 'Liked a post', location: 'San Francisco Marriott', time: '5 hours ago', icon: '❤️' },
    { action: 'Started following', location: '@traveler_jane', time: '1 day ago', icon: '👤' },
    { action: 'Saved a location', location: 'Hyderabad Marriott', time: '2 days ago', icon: '🔖' },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className="flex-none sticky top-0 h-screen">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header Banner */}
        <div className="relative h-40 bg-gradient-to-r from-[#a11d2b] to-[#8B1523]">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute bottom-0 left-0 right-0 px-8 pb-4">
            <div className="flex items-end gap-4">
              {/* Profile Picture */}
              <div className="relative">
                {avatar ? (
                  <img 
                    src={avatar} 
                    alt={username}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-2xl object-cover bg-white"
                  />
                ) : (
                  <Avatar 
                    sx={{ 
                      width: 96, 
                      height: 96, 
                      bgcolor: '#a11d2b',
                      border: '4px solid white',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 56 }} />
                  </Avatar>
                )}
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              {/* User Info */}
              <div className="flex-1 pb-2">
                <h1 className="text-3xl font-bold text-white mb-1">{username}</h1>
                    <p className="text-rose-100 text-base">{email}</p>
                    <p className="text-rose-200 text-xs mt-0.5">Member since {memberSince}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pb-2">
                <button 
                  onClick={handleOpenEditModal}
                  className="px-5 py-2 bg-white text-[#a11d2b] rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-lg text-sm"
                >
                  Edit Profile
                </button>
                <button className="px-5 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all text-sm">
                  Share Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="max-w-7xl mx-auto px-8 pt-8 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl shadow-md`}>
                    {stat.icon}
                  </div>
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Travel Statistics */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-7 h-7 text-[#a11d2b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Travel Statistics
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {activityStats.map((stat, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-100"
                  >
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm font-semibold text-gray-700 mb-1">{stat.label}</div>
                    <div className="text-xs text-rose-600 font-medium">{stat.change}</div>
                  </div>
                ))}
              </div>

              {/* Progress Bars */}
              <div className="mt-6 space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Profile Completion</span>
                    <span className="text-[#a11d2b]">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-[#a11d2b] to-[#8B1523] h-3 rounded-full shadow-sm" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                    <span>Annual Travel Goal</span>
                    <span className="text-[#a11d2b]">67%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full shadow-sm" style={{ width: '67%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-7 h-7 text-[#a11d2b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600 truncate">{activity.location}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Badges/Achievements */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-7 h-7 text-[#0891B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Achievements & Badges
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'Early Adopter', emoji: '🎯', unlocked: true },
                { name: 'Globetrotter', emoji: '🌍', unlocked: true },
                { name: 'Photo Pro', emoji: '📸', unlocked: true },
                { name: 'Social Butterfly', emoji: '🦋', unlocked: true },
                { name: 'Verified Traveler', emoji: '✅', unlocked: true },
                { name: 'Explorer', emoji: '🗺️', unlocked: false },
              ].map((badge, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-xl text-center transition-all ${
                    badge.unlocked 
                      ? 'bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-[#a11d2b] shadow-md hover:shadow-lg' 
                      : 'bg-gray-100 border-2 border-gray-200 opacity-50'
                  }`}
                >
                  <div className="text-4xl mb-2">{badge.emoji}</div>
                  <div className="text-xs font-semibold text-gray-700">{badge.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveProfile}
        username={username}
        avatar={avatar}
        email={email}
        editUsername={editUsername}
        setEditUsername={setEditUsername}
        editBio={editBio}
        setEditBio={setEditBio}
        editLocation={editLocation}
        setEditLocation={setEditLocation}
      />

      {/* Success Snackbar */}
      <Snackbar 
        open={showSnackbar} 
        autoHideDuration={4000} 
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity="success" 
          sx={{ 
            width: '100%',
            backgroundColor: '#a11d2b',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white'
            }
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

