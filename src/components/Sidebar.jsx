import React, { useContext } from "react";
import Profile from './Profile';
import { AuthContext } from '../auth/AuthProvider';

export default function Sidebar({ onOpenPost }) {
    const { logout } = useContext(AuthContext);
    return (
    <aside className="w-90 mx-auto bg-[#B81843] text-white min-h-screen p-6 flex flex-col">
        <div className="mb-6">
            <h2 className="text-xl font-bold">Marriot-Go</h2>
        </div>

        <nav className="flex-1">
            <ul className="space-y-3">
                <li>
                    <button
                        style={{ color: "black" }}
                        onClick={() => {
                            onOpenPost?.();
                        }}
                        className="text-left !bg-white text-black px-3 py-2 rounded w-50 min-w-[120px]"
                    >
                        + New Post
                    </button>
                </li>
            </ul>
        </nav>

        <div className="mt-6">
            <Profile />
            <div className="mt-4">
                <button onClick={logout} className="bg-white text-black px-3 py-2 rounded">Logout</button>
            </div>
        </div>
    </aside>
    );
}
