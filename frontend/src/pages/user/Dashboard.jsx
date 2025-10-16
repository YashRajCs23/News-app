import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import { listMine, listMyNews } from "../../services/bookmarkService";

const Dashboard = () => {
  const { user, logout } = useUserContext();
  const [bookmarks, setBookmarks] = useState([]);
  const [newsBookmarks, setNewsBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        if (!user) {
          navigate("/login");
          return;
        }
        setLoading(true);
        const [bookmarksData, newsBookmarksData] = await Promise.all([
          listMine(),
          listMyNews(),
        ]);
        setBookmarks(bookmarksData);
        setNewsBookmarks(newsBookmarksData);
      } catch (error) {
        console.error("Error loading bookmarks:", error);
        setBookmarks([]);
        setNewsBookmarks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [navigate, user]);

  const handleLogout = () => {
    logout(); 
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
          {loading ? (
            <p className="text-slate-400 text-sm">Loading bookmarks...</p>
          ) : (
            <>
              {/* Story bookmarks */}
              {bookmarks.length > 0 && (
                <>
                  <h4 className="text-blue-300 text-sm mb-2">Stories</h4>
                  <ul className="space-y-2 mb-4">
                    {bookmarks.map((bookmark, index) => (
                      <li
                        key={bookmark._id || index}
                        className="bg-slate-700 hover:bg-slate-600 transition p-3 rounded-lg text-sm flex justify-between items-center"
                      >
                        <span>{bookmark.story?.title || bookmark.title}</span>
                        <button
                          onClick={() => navigate(`/story/${bookmark.story?._id || bookmark.id}`)}
                          className="text-blue-400 hover:text-blue-300 text-xs"
                        >
                          View →
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {/* News bookmarks */}
              {newsBookmarks.length > 0 && (
                <>
                  <h4 className="text-yellow-300 text-sm mb-2">News Articles</h4>
                  <ul className="space-y-2">
                    {newsBookmarks.map((bookmark, index) => (
                      <li
                        key={bookmark._id || index}
                        className="bg-slate-700 hover:bg-slate-600 transition p-3 rounded-lg text-sm flex justify-between items-center"
                      >
                        <span>{bookmark.title || bookmark.url}</span>
                        <a
                          href={bookmark.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-yellow-400 hover:text-yellow-300 text-xs"
                        >
                          View →
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {bookmarks.length === 0 && newsBookmarks.length === 0 && (
                <p className="text-slate-400 text-sm">
                  No bookmarks yet.{' '}
                  <span
                    className="text-blue-400 hover:text-blue-300 cursor-pointer"
                    onClick={() => navigate("/home")}
                  >
                    Browse news to bookmark!
                  </span>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
