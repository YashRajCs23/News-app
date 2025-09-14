import { useState, useEffect } from "react";

const NewsFeed = ({ category }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=343150d47242485d914a0b44b58a921e`;

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch news");
        const data = await response.json();
        if (data.articles.length === 0)
          throw new Error("No articles found for this category");
        setArticles(data.articles);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category]);

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
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;
