import React, { useContext } from 'react';
import { AuthContext } from '../auth/AuthProvider';

export default function Profile({ compact = false }) {
  const { user } = useContext(AuthContext);
  const username = user?.user_metadata?.username || user?.email || 'Guest';
  const avatar = user?.user_metadata?.avatar_url || '/react.svg';

  return (
    <div className={`flex items-center gap-3 ${compact ? 'text-sm' : ''}`}>
      <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full border" />
      <div>
        <div className="font-semibold text-white">{username}</div>
        <div className="text-xs text-red-100">{user ? 'Signed in' : 'Not signed in'}</div>
      </div>
    </div>
  );
}
