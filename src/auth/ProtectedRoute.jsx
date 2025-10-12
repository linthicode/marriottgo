import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  // while user is undefined, we are loading the auth state
  if (user === undefined) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">Checking session…</div>
    </div>
  );
  if (!user) return <Navigate to="/" replace />;
  return children;
}
