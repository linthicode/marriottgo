import React, { useState } from "react";
import supabase  from "../helper/supabaseClient";
import { Link, useNavigate } from "react-router-dom";


export default function Login() {
    const [mode, setMode] = useState("login"); 
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState('');

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
                setEmail("");
                setPassword("");
                navigate("/dashboard");
                return;
            }
        }
    };

return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="flex flex-col justify-center">
            <img
                src="/marriottlogo.svg"
                alt="Marriott Logo"
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
                        required
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    />
                )}
                <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full border rounded px-3 py-2"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <br></br>
                {message && <span className="text-sm text-red-500 mb-2">{message}</span>}
                <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    className="w-full border rounded px-3 py-2"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
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
