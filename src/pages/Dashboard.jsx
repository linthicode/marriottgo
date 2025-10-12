import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import ModalPost from "../components/ModalPost";

const KEY = "mm_posts_v1";

export default function Dashboard() {
  const [showPostModal, setShowPostModal] = useState(false);
  const [posts, setPosts] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(KEY) || "null");
      if (Array.isArray(stored)) return stored;
    } catch {}

    // default sample post (you can replace image files in public/images/)
    return [];
  });

   function handleCreate(post) {
    setPosts((prev) => {
      const next = [post, ...prev];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
    setShowPostModal(false);
  }

  function handleReset() {
    if (!confirm("Reset posts to default sample? This will clear saved posts.")) return;
    localStorage.removeItem(KEY);
    // reset to the same initial sample used above
    const sample = [
      {},
    ];
    setPosts(sample);
  }
  return (
    <div className="flex min-h-screen">
      {/* Sidebar stays a fixed width and is sticky */}
      <div className="flex-none sticky top-0 h-screen">
        <Sidebar onOpenPost={() => setShowPostModal(true)} />
      </div>

      {/* Main content scrolls independently */}
      <div className="flex-1 bg-gray-100 p-6 overflow-auto max-h-screen">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleReset}
            className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reset posts
          </button>
        </div>
        {posts.length === 0 ? (
          <div className="text-gray-500">No posts yet</div>
        ) : (
          posts.map((p) => <PostCard key={p.id} post={p} />)
        )}
      </div>

      {showPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="w-full max-w-3xl">
            <ModalPost onCancel={() => setShowPostModal(false)}
             onCreate = {handleCreate}
            />
            
          </div>
        </div>
      )}
    </div>
  );
}
