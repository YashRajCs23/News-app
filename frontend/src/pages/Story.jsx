import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStoryById } from "../services/storyService";

const Story = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        const data = await getStoryById(id);
        console.log("Story data received:", data);
        
        // Handle if response is wrapped in a data property
        const storyData = data?.data || data;
        setStory(storyData);
      } catch (err) {
        console.error("Error fetching story:", err);
        setError(err.message || "Failed to load story.");
      } finally {
        setLoading(false);
      }
    };

    if (!id) {
      navigate("/home");
      return;
    }

    fetchStory();
  }, [id, navigate]);

  if (loading) return <div className="p-8 text-center text-slate-400">Loading story...</div>;
  if (error) return <div className="p-8 text-center text-red-400">{error}</div>;
  if (!story) return <div className="p-8 text-center text-slate-400">Story not found.</div>;

  // Safely extract and convert all values to safe strings/primitives
  const title = String(story.title || "Untitled").trim();
  
  // Safely extract author name
  let authorName = "Unknown";
  try {
    if (story.author) {
      if (typeof story.author === "string") {
        authorName = String(story.author).trim();
      } else if (typeof story.author === "object" && story.author.name) {
        authorName = String(story.author.name).trim();
      }
    }
  } catch (e) {
    console.error("Error extracting author:", e);
  }

  // Safely extract category name
  let categoryName = "General";
  try {
    if (story.category) {
      if (typeof story.category === "string") {
        categoryName = String(story.category).trim();
      } else if (typeof story.category === "object" && story.category.name) {
        categoryName = String(story.category.name).trim();
      }
    }
  } catch (e) {
    console.error("Error extracting category:", e);
  }

  // Format the date safely
  let formattedDate = "Date unavailable";
  try {
    const dateValue = story.createdAt || story.date || story.created;
    if (dateValue) {
      const storyDate = new Date(dateValue);
      if (!isNaN(storyDate.getTime())) {
        formattedDate = storyDate.toLocaleString();
      }
    }
  } catch (e) {
    console.error("Date formatting error:", e);
  }

  // Safely extract and convert content to string
  let content = "No content available";
  try {
    const rawContent = story.content || story.body || story.description;
    if (rawContent) {
      // If it's an object, stringify it; if string, use as-is
      content = typeof rawContent === "object" ? JSON.stringify(rawContent) : String(rawContent);
    }
  } catch (e) {
    console.error("Error extracting content:", e);
    content = "Unable to display content";
  }

  return (
    <div className="min-h-screen p-8 bg-slate-900 text-white">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-teal-400 hover:text-teal-300 transition text-sm"
      >
        ← Back
      </button>
      
      <div className="max-w-4xl mx-auto bg-slate-800 rounded-lg p-8">
        <h1 className="text-3xl font-semibold mb-2 text-teal-400">
          {title}
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          By <span className="text-slate-200">{authorName}</span> • {formattedDate}
        </p>

        {story.imageUrl && typeof story.imageUrl === "string" && (
          <img
            src={story.imageUrl}
            alt={title}
            className="w-full max-h-96 object-cover rounded-lg mb-6"
          />
        )}

        <div className="text-slate-200 leading-relaxed mb-6 whitespace-pre-wrap">
          {content}
        </div>

        <div className="text-sm text-slate-400 border-t border-slate-700 pt-4">
          Category: <span className="text-slate-200">{categoryName}</span>
        </div>
      </div>
    </div>
  );
};

export default Story;
