import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NewsFeed from "../components/NewsFeed";

function Home({category}) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Load user from localStorage or create a default guest
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      const guestUser = {
        name: "Guest User",
        email: "guest@example.com",
        role: "user",
      };
      localStorage.setItem("user", JSON.stringify(guestUser));
      setUser(guestUser);
    } else {
      setUser(storedUser);
    }
  }, []);

  if (!user)
    return (
      <div className="text-center mt-20 text-slate-400">
        Loading your news feed...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-5">
      {/* ---------- HEADER ---------- */}
      
      

      {/* ---------- NEWS FEED ---------- */}
      <NewsFeed category={category} />

      {/* ---------- ROLE-BASED ACTIONS ---------- */}
      <div className="mt-10">
        {user.role === "admin" && (
          <div className="bg-slate-800 p-4 rounded-lg border border-teal-600 mt-4">
            <h2 className="text-lg font-semibold text-teal-400 mb-2">
              Admin Panel
            </h2>
            <p className="text-sm text-slate-300 mb-3">
              You can manage users, approve editors, and moderate all content.
            </p>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="bg-yellow-400 text-slate-900 px-4 py-2 rounded-md font-semibold hover:bg-yellow-500 transition"
            >
              Go to Admin Panel
            </button>
          </div>
        )}

        {user.role === "editor" && (
          <div className="bg-slate-800 p-4 rounded-lg border border-blue-600 mt-4">
            <h2 className="text-lg font-semibold text-blue-400 mb-2">
              Editor Dashboard
            </h2>
            <p className="text-sm text-slate-300 mb-3">
              You can add or edit news stories and manage your own posts.
            </p>
            <button
              onClick={() => navigate("/editor/dashboard")}
              className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600 transition"
            >
              Add New Story
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
