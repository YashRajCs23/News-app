import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";

const Dashboard = () => {
  const { user, logout } = useUserContext();
  const [bookmarks, setBookmarks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (!user) {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) {
          navigate("/login");
          return;
        }
      }

      const storedBookmarks =
        JSON.parse(localStorage.getItem("bookmarks")) || [];
      setBookmarks(storedBookmarks);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      navigate("/login");
    }
  }, [navigate, user]);

  const handleLogout = () => {
    logout(); // clears context + localStorage
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center py-12 px-4">
      <div className="bg-slate-800 rounded-2xl shadow-lg w-full max-w-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-blue-400">
            Welcome, {user.name || "User"} 👋
          </h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 rounded-md transition"
          >
            Logout
          </button>
        </div>

        <div className="border-t border-slate-700 pt-4">
          <p className="text-sm text-slate-300 mb-2">
            <strong>Email:</strong> {user.email}
          </p>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium mb-3">📚 Your Bookmarks</h3>

          {bookmarks.length > 0 ? (
            <ul className="space-y-2">
              {bookmarks.map((bookmark, index) => (
                <li
                  key={index}
                  className="bg-slate-700 hover:bg-slate-600 transition p-3 rounded-lg text-sm flex justify-between items-center"
                >
                  <span>{bookmark.title}</span>
                  <button
                    onClick={() => navigate(`/story/${bookmark.id}`)}
                    className="text-blue-400 hover:text-blue-300 text-xs"
                  >
                    View →
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400 text-sm">
              No bookmarks yet.{" "}
              <span
                className="text-blue-400 hover:text-blue-300 cursor-pointer"
                onClick={() => navigate("/add-story")}
              >
                Add one now!
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
