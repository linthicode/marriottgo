import React, { useState, useContext } from "react";
import supabase  from "../helper/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";


export default function Login() {
    const [mode, setMode] = useState("login"); 
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState('');

    const { setUser } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (mode === "signup") {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { username } }
            });

            if (error) {
                setMessage(error.message);
                return;
            }

            if (data) {
                setMessage("User account created!");
                // set global user from supabase response
                setUser(data.user ?? null);
                setEmail("");
                setPassword("");
                setUsername("");
                navigate("/onboarding");
                return;
            }
        } else {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                setMessage(error.message);
                return;
            }

            if (data) {
                setMessage("");
                // set global user and navigate
                setUser(data.user ?? null);
                setEmail("");
                setPassword("");
                navigate("/dashboard");
                return;
            }
        }
    };

return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#a11d2b] via-[#8B1523] to-[#6B0F1C] p-4">
        <div className="max-w-md w-full">
            {/* Logo */}
            <div className="text-center mb-8">
                <div className="bg-white rounded-full w-24 h-24 mx-auto flex items-center justify-center shadow-2xl mb-4">
                    <img
                        src="/marriottlogo.svg"
                        alt="Marriott Logo"
                        className="h-16 w-16"
                        draggable={false}
                    />
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">MarriottGo</h1>
                <p className="text-rose-100">Share your travel experiences</p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8">
                {/* Login / Signup Toggle */}
                <div className="flex gap-2 bg-gray-100 rounded-2xl p-1 mb-6">
                    <button
                        type="button"
                        onClick={() => setMode("login")}
                        className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                            mode === "login"
                                ? "bg-gradient-to-r from-[#a11d2b] to-[#8B1523] text-white shadow-md"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("signup")}
                        className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                            mode === "signup"
                                ? "bg-gradient-to-r from-[#a11d2b] to-[#8B1523] text-white shadow-md"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Sign up
                    </button>
                </div>

                {/* Header */}
                <header className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {mode === "login"
                            ? "Welcome back!"
                            : "Create your account"}
                    </h2>
                    <p className="text-gray-500 mt-2">
                        {mode === "login"
                            ? "Sign in to continue your journey"
                            : "Join our travel community today"}
                    </p>
                </header>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {mode === "signup" && (
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Choose a username"
                                    className="w-full border-2 border-gray-300 rounded-xl pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:border-[#a11d2b] focus:ring-2 focus:ring-[#a11d2b]/20 transition-all"
                                    required
                                    onChange={(e) => setUsername(e.target.value)}
                                    value={username}
                                />
                            </div>
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                className="w-full border-2 border-gray-300 rounded-xl pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:border-[#a11d2b] focus:ring-2 focus:ring-[#a11d2b]/20 transition-all"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="w-full border-2 border-gray-300 rounded-xl pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:border-[#a11d2b] focus:ring-2 focus:ring-[#a11d2b]/20 transition-all"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                        </div>
                    </div>

                    {message && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-red-700">{message}</span>
                        </div>
                    )}

                    <button 
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#a11d2b] to-[#8B1523] hover:from-[#8B1523] hover:to-[#a11d2b] text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        {mode === "login" ? (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                <span>Sign In</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                <span>Create Account</span>
                            </>
                        )}
                    </button>
                </form>

                {mode === "login" && (
                    <div className="mt-6 text-center">
                        <a href="#" className="text-sm text-[#a11d2b] hover:text-[#8B1523] font-medium">
                            Forgot your password?
                        </a>
                    </div>
                )}
            </div>

            <p className="text-center text-white/80 text-sm mt-6">
                By continuing, you agree to our{' '}
                <a 
                    href="https://www.marriott.com/about/terms-of-use.mi" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white font-semibold hover:underline"
                >
                    Terms of Service
                </a>
                {' '}and Privacy Policy
            </p>
        </div>
    </div>
);
}
