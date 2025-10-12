import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  // while user is undefined, we are loading the auth state
  if (user === undefined) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 border-4 border-[#a11d2b]/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-[#a11d2b] rounded-full animate-spin"></div>
          
          {/* Inner spinning ring (opposite direction) */}
          <div className="absolute inset-3 border-4 border-[#8B1523]/20 rounded-full"></div>
          <div className="absolute inset-3 border-4 border-transparent border-b-[#8B1523] rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
          
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-r from-[#a11d2b] to-[#8B1523] rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">🏨</span>
            </div>
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Loading MarriottGo</h3>
        <p className="text-gray-600 text-sm">Checking your session...</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
