import React, { createContext, useEffect, useState } from 'react';
import supabase from '../helper/supabaseClient';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext({ user: null, setUser: () => {}, logout: async () => {} });

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading, null = no user
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        
        // If no user from Supabase, check localStorage for onboarding flow
        if (!data?.user) {
          const storedUser = localStorage.getItem('mm_current_user');
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
              console.debug('AuthProvider: using stored user for onboarding', parsedUser);
              return;
            } catch (e) {
              console.warn('AuthProvider: failed to parse stored user', e);
            }
          }
        }
        
        setUser(data?.user ?? null);
        console.debug('AuthProvider: initial user', data?.user ?? null);
      } catch (err) {
        if (!mounted) return;
        setUser(null);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      try { sub.subscription.unsubscribe(); } catch {}
    };
  }, []);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    localStorage.removeItem('mm_current_user');
    setUser(null);
    console.debug('AuthProvider: logged out, navigating to /login');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
