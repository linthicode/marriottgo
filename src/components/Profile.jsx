import React, { useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';

export default function Profile({ compact = false }) {
  const { user } = useContext(AuthContext);
  const username = user?.user_metadata?.username || user?.email || 'Guest';
  const avatar = user?.user_metadata?.avatar_url;

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-all duration-200 ${compact ? 'text-sm' : ''}`}>
      <div className="relative">
        {avatar ? (
          <img 
            src={avatar} 
            alt="avatar" 
            className="w-12 h-12 rounded-full border-2 border-white/30 shadow-lg object-cover" 
          />
        ) : (
          <Avatar 
            sx={{ 
              width: 48, 
              height: 48, 
              bgcolor: '#a11d2b',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
          >
            <PersonIcon sx={{ fontSize: 32 }} />
          </Avatar>
        )}
        {user && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-white truncate">{username}</div>
        <div className="flex items-center gap-1 text-xs text-rose-100">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{user ? 'Online' : 'Offline'}</span>
        </div>
      </div>
    </div>
  );
}
