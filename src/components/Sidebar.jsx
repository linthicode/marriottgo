import React, { useContext } from "react";
import Profile from './Profile';
import { AuthContext } from '../auth/AuthProvider';

export default function Sidebar({ onOpenPost }) {
    const { logout } = useContext(AuthContext);
    return (
    <aside className="w-80 bg-gradient-to-b from-[#a11d2b] to-[#8B1523] text-white min-h-screen shadow-2xl flex flex-col">
        {/* Logo Section */}
        <div className="p-8 border-b border-white/10">
            <div className="flex justify-center mb-4">
                <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center shadow-lg p-2">
                    <img src="/marriottlogo.svg" alt="Marriott Logo" className="w-full h-full object-contain" />
                </div>
            </div>
            <p className="text-rose-100 text-sm text-center">Share your journey, inspire others</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6">
            <button
                onClick={() => onOpenPost?.()}
                className="w-full bg-white hover:bg-gray-50 text-[#a11d2b] px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group"
            >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Experience</span>
            </button>

            <div className="mt-8 space-y-2">
                <a href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="font-medium">Home</span>
                </a>
                <a href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">Profile</span>
                </a>
                <a href="/map" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <span className="font-medium">Explore Map</span>
                </a>
                <a href="/memories" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                    <span className="font-medium">Memories</span>
                </a>
            </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-6 border-t border-white/10 space-y-4">
            <a href="/profile" className="block cursor-pointer">
                <Profile />
            </a>
            <button 
                onClick={logout} 
                className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sign Out</span>
            </button>
        </div>
    </aside>
    );
}
