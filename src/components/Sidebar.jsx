import React from "react";

export default function Sidebar({ onOpenPost }) {
return (
    <aside className="w-90 mx-auto bg-[#B81843] text-white min-h-screen p-6 flex flex-col">
        <div className="mb-6">
            <h2 className="text-xl font-bold">Marriot-Go</h2>
        </div>

        <nav className="flex-1">
            <ul className="space-y-3">
                <li>
                    <button 
                        style = {{color:"black"}}
                        onClick={onOpenPost}
                        className="text-left !bg-white text-black px-3 py-2 rounded w-50 min-w-[120px]"
                    >
                        + New Post
                    </button>
                </li>
            </ul>
        </nav>

        <footer className="mt-6 text-xs text-red-100">
            <div>Signed in as <strong>dev</strong></div>
        </footer>
    </aside>
);
}
