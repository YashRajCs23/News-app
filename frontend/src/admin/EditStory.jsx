import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditStory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [story, setStory] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ✅ Fetch existing story data
  useEffect(() => {
    const fetchStory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/stories/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch story");
        const data = await response.json();
        setStory({
          title: data.title || "",
          description: data.description || "",
          imageUrl: data.imageUrl || "",
          category: data.category || "",
        });
      } catch (err) {
        console.error("Error fetching story:", err);
        setMessage("Error loading story details");
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/stories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(story),
      });

      if (!response.ok) throw new Error("Failed to update story");

      setMessage("Story updated successfully ✅");
      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch (err) {
      console.error("Error updating story:", err);
      setMessage("Error updating story ❌");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStory((prev) => ({ ...prev, [name]: value }));
  };

  if (loading)
    return (
      <p className="text-yellow-400 text-center mt-10 font-['Orbitron']">
        Loading story...
      </p>
    );

  return (
    <div className="min-h-screen bg-black text-slate-200 px-6 py-10 font-['Orbitron']">
      <h1 className="text-3xl text-teal-500 font-bold mb-8 text-center">
        Edit Story
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-slate-900 p-8 rounded-2xl shadow-lg shadow-teal-500/20"
      >
        {/* Title */}
        <div className="mb-5">
          <label className="block text-sm mb-2 text-teal-400">Title</label>
          <input
            type="text"
            name="title"
            value={story.title}
            onChange={handleChange}
            required
            className="w-full p-3 rounded bg-black text-white border border-slate-700 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Description */}
        <div className="mb-5">
          <label className="block text-sm mb-2 text-teal-400">
            Description
          </label>
          <textarea
            name="description"
            value={story.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full p-3 rounded bg-black text-white border border-slate-700 focus:outline-none focus:border-teal-500"
          ></textarea>
        </div>

        {/* Image URL */}
        <div className="mb-5">
          <label className="block text-sm mb-2 text-teal-400">
            Image URL
          </label>
          <input
            type="text"
            name="imageUrl"
            value={story.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full p-3 rounded bg-black text-white border border-slate-700 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Category */}
        <div className="mb-5">
          <label className="block text-sm mb-2 text-teal-400">Category</label>
          <select
            name="category"
            value={story.category}
            onChange={handleChange}
            className="w-full p-3 rounded bg-black text-white border border-slate-700 focus:outline-none focus:border-teal-500"
          >
            <option value="">Select Category</option>
            <option value="general">General</option>
            <option value="world">World</option>
            <option value="technology">Technology</option>
            <option value="sports">Sports</option>
            <option value="business">Business</option>
            <option value="entertainment">Entertainment</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-teal-500 hover:bg-yellow-400 text-black py-2 rounded font-bold transition"
        >
          Save Changes
        </button>

        {/* Message */}
        {message && (
          <p className="text-center mt-4 text-yellow-400">{message}</p>
        )}
      </form>
    </div>
  );
};

export default EditStory;
