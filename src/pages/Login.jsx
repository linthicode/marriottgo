import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


export default function Login() {
    const [mode, setMode] = useState("login"); // "login" | "signup"
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        // Demo auth: create a small user in localStorage.
        // For signup, we want to send the user to onboarding because we don't know them yet.
        const isSignup = mode === "signup";
        const demoUser = {
            id: isSignup ? `u_${Date.now()}` : "u_dev",
            email: document.getElementById("email").value || "dev@example.com",
            onboarded: !isSignup, // logged-in users are treated as already onboarded for dev flow
        };
        localStorage.setItem("mm_current_user", JSON.stringify(demoUser));

        if (isSignup) navigate("/onboarding");
        else navigate("/dashboard");
    }

return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="flex flex-col justify-center">
            <img
                src="/marriotgo.svg"
                alt="MarriotGo Logo"
                className="h-48 w-auto"
                draggable={false}
            />
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-gray-500">
            
            {/* Login / Signup Toggle */}
            <div className="flex justify-center items-center gap-3 mb-4">
                <span
                    onClick={() => setMode("login")}
                    className={`cursor-pointer text-lg font-medium transition-colors ${
                        mode === "login"
                            ? "text-gray-400 underline"
                            : "text-gray-400 hover:text-gray-500"
                    }`}
                >
                    Login
                </span>
                <span className="text-gray-400">|</span>
                <span
                    onClick={() => setMode("signup")}
                    className={`cursor-pointer text-lg font-medium transition-colors ${
                        mode === "signup"
                            ? "text-gray-400 underline"
                            : "text-gray-400 hover:text-gray-500"
                    }`}
                >
                    Sign up
                </span>
            </div>

            {/* Header */}
            <header className="mb-6 text-center">
                <p className="text-2xl text-gray-500">
                    {mode === "login"
                        ? "Welcome back"
                        : "Create an account to get started"}
                </p>
            </header>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                    <input
                        id="username"
                        type="text"
                        placeholder="Username"
                        className="w-full border rounded px-3 py-2"
                    />
                )}

                <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full border rounded px-3 py-2"
                    defaultValue="dev@example.com"
                />

                <input
                    id="password"
                    type="password"
                    placeholder="password"
                    className="w-full border rounded px-3 py-2"
                    defaultValue="password"
                />

                <button className="w-full bg-[#B81843] text-white py-2 rounded">
                    {mode === "login" ? "Log in" : "Create account"}
                </button>
            </form>
            <div className="mt-4 text-center text-sm text-gray-500">
                <p>
                    Developer shortcuts:{" "}
                    <Link to="/dashboard" className="text-[#B81843] hover:underline">
                        Go to Dashboard
                    </Link>
                </p>
            </div>
        </div>
    </div>
);
}
