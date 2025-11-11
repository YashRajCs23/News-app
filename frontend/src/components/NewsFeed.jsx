import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { deleteStory as deleteStoryApi } from "../services/storyService";
import http from "../services/http";
import { addNews as addBookmark, removeNews as removeBookmark } from "../services/bookmarkService";

const NewsFeed = ({ category }) => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarkedArticles, setBookmarkedArticles] = useState(new Set());
  const [communityStories, setCommunityStories] = useState([]);
  const { user } = useUserContext();

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await http.get("/api/news", {
          params: { category }
        });
        const data = response.data;
        if (!data.articles || data.articles.length === 0)
          throw new Error("No articles found for this category");
        setArticles(data.articles);
        // fetch approved community stories for this category
        try {
          const sres = await http.get("/api/stories", { params: { category } });
          setCommunityStories(Array.isArray(sres.data) ? sres.data : []);
        } catch (e) {
          // don't block primary news fetch if stories fail
          console.warn("Failed to fetch community stories:", e.message || e);
          setCommunityStories([]);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category]);

  const handleBookmark = async (article) => {
    try {
      // For news articles, we'll use the article URL as a unique identifier
      const articleId = article.url || article.title;
      
      if (bookmarkedArticles.has(articleId)) {
        // Remove bookmark
        await removeBookmark(articleId);
        setBookmarkedArticles(prev => {
          const newSet = new Set(prev);
          newSet.delete(articleId);
          return newSet;
        });
      } else {
        // Add bookmark
        await addBookmark({
          url: articleId,
          title: article.title,
          sourceName: article?.source?.name,
          imageUrl: article.urlToImage,
        });
        setBookmarkedArticles(prev => new Set([...prev, articleId]));
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      alert("Failed to update bookmark. Please try again.");
    }
  };

  if (loading)
    return (
      <p className="text-lg text-yellow-400 mt-5 text-center">
        Fetching {category} news...
      </p>
    );
  if (error)
    return (
      <p className="text-lg text-yellow-400 mt-5 text-center">{error}</p>
    );

  return (
    <div className="px-4 py-5 flex flex-col items-center">
      <h2 className="font-['Orbitron'] text-2xl font-bold mb-5 uppercase text-teal-500 text-center">
        {category} News
      </h2>

      <div className="grid gap-5 w-full max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
        {articles.map((article, index) => (
          <div
            key={index}
            className="bg-black text-slate-200 p-4 rounded-lg shadow-md shadow-teal-500/30 transition-transform duration-300 flex flex-col font-['Orbitron'] hover:scale-105"
          >
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="w-full h-52 object-cover rounded-md"
              />
            )}
            <h3 className="text-lg font-bold my-2">{article.title}</h3>
            <p className="text-sm text-slate-400 flex-grow">
              {article.description || "No description available."}
            </p>

            {/* Footer */}
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-slate-400">
                {article.source.name}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBookmark(article)}
                  className={`text-sm px-2 py-1 rounded transition ${
                    bookmarkedArticles.has(article.url || article.title)
                      ? "bg-yellow-400 text-black"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                  title={bookmarkedArticles.has(article.url || article.title) ? "Remove bookmark" : "Add bookmark"}
                >
                  {bookmarkedArticles.has(article.url || article.title) ? "★" : "☆"}
                </button>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-500 font-bold text-sm hover:text-yellow-400 transition"
                >
                  Read More →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Community Stories (user-submitted and admin-approved) */}
      {communityStories && communityStories.length > 0 && (
        <div className="w-full max-w-[1200px] mt-8">
          <h3 className="text-xl font-bold mb-4 text-teal-400">Community Stories</h3>
          <div className="grid gap-5">
            {communityStories.map((story) => (
              <div key={story._id} className="bg-slate-800 p-4 rounded-md text-slate-200">
                {story.imageUrl && (
                  <img src={story.imageUrl} alt={story.title} className="w-full h-48 object-cover rounded-md mb-3" />
                )}
                <h4 className="text-lg font-semibold">{story.title}</h4>
                <p className="text-sm text-slate-400">By {((typeof story.author === 'object') ? (story.author.name || story.author.email || story.author._id) : story.author) || "Unknown"} • {new Date(story.createdAt).toLocaleString()}</p>
                <p className="mt-2 text-slate-300">{story.content?.slice(0, 180)}{story.content && story.content.length > 180 ? "..." : ""}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Category: {((typeof story.category === 'object') ? (story.category.name || "—") : story.category) || "—"}</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/story/${story._id}`)}
                      className="text-teal-400 font-semibold hover:text-teal-300 transition"
                    >
                      Read →
                    </button>
                    {/* If current user is the admin who reviewed (approved) this story, show remove */}
                    {user && user.role === "admin" ? (
                      <button
                        onClick={async () => {
                          if (!confirm("Remove this story? This will permanently delete it.")) return;
                          try {
                            // optimistic UI
                            const prev = communityStories;
                            setCommunityStories(prev.filter(s => String(s._id) !== String(story._id)));
                            await deleteStoryApi(story._id);
                          } catch (e) {
                            alert("Failed to remove story: " + (e.message || e));
                            // revert by re-fetching stories for category
                            try {
                              const sres = await http.get("/api/stories", { params: { category } });
                              setCommunityStories(Array.isArray(sres.data) ? sres.data : []);
                            } catch (_) {
                              // ignore
                            }
                          }
                        }}
                        className="text-red-400 font-semibold hover:text-red-300 transition"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
