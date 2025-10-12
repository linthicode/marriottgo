import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';

export default function EditProfileModal({
  open,
  onClose,
  onSave,
  username,
  avatar,
  email,
  editUsername,
  setEditUsername,
  editBio,
  setEditBio,
  editLocation,
  setEditLocation
}) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: '#a11d2b', color: 'white' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Edit Profile</h2>
            <p className="text-rose-100 text-sm">Update your profile information</p>
          </div>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        <div className="p-6 space-y-6">
          {/* Profile Picture Section */}
          <div className="flex items-center gap-6 p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border-2 border-[#a11d2b]/30">
            <div className="relative">
              {avatar ? (
                <img 
                  src={avatar} 
                  alt={username}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <Avatar 
                  sx={{ 
                    width: 96, 
                    height: 96, 
                    bgcolor: '#a11d2b',
                    border: '4px solid white',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <PersonIcon sx={{ fontSize: 56 }} />
                </Avatar>
              )}
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#a11d2b] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#8B1523] transition-colors shadow-lg border-2 border-white">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Profile Picture</h3>
              <p className="text-sm text-gray-600 mb-3">Click the camera icon to upload a new photo</p>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                id="avatar-upload"
              />
              <label 
                htmlFor="avatar-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#a11d2b] text-[#a11d2b] rounded-lg text-sm font-semibold cursor-pointer hover:bg-[#a11d2b] hover:text-white transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload Photo
              </label>
            </div>
          </div>

          {/* Username Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={editUsername}
              onChange={(e) => setEditUsername(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[#a11d2b] focus:ring-2 focus:ring-[#a11d2b]/20 transition-all"
              placeholder="Enter your username"
            />
          </div>

          {/* Email Field (Read-only) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-500 bg-gray-50 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          {/* Location Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[#a11d2b] focus:ring-2 focus:ring-[#a11d2b]/20 transition-all"
              placeholder="Where are you from?"
            />
          </div>

          {/* Bio Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              rows={4}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[#a11d2b] focus:ring-2 focus:ring-[#a11d2b]/20 transition-all resize-none"
              placeholder="Tell us about yourself..."
            />
            <p className="text-xs text-gray-500 mt-1">{editBio.length}/200 characters</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 p-6 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#a11d2b] to-[#8B1523] hover:from-[#8B1523] hover:to-[#a11d2b] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Changes
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

