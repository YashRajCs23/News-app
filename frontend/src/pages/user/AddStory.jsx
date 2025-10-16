import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import storyService from "../../services/storyService";

const AddStory = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (!title.trim() || !content.trim()) {
      setMessage("Title and content are required!");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const newStory = {
        title,
        content,
        author: user.name || "Anonymous",
        email: user.email,
        date: new Date().toISOString(),
      };

      await storyService.addStory(newStory);

      const existing = JSON.parse(localStorage.getItem("stories")) || [];
      localStorage.setItem("stories", JSON.stringify([...existing, newStory]));

      setMessage("Story added successfully ✅");
      setTitle("");
      setContent("");

      setTimeout(() => navigate("/user/dashboard"), 1200);
    } catch (error) {
      console.error(error);
      setMessage("Failed to add story. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center py-12 px-4">
      <div className="bg-slate-800 w-full max-w-2xl rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-blue-400">
          ✍️ Add a New Story
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-2 text-slate-300">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your story title"
              className="w-full p-3 rounded-md bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-slate-300">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your story here..."
              rows="6"
              className="w-full p-3 rounded-md bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {message && (
            <p
              className={`text-sm ${
                message.includes("success") ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 transition text-sm font-medium py-3 rounded-md disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Story"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStory;
