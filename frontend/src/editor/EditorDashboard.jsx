import React, { useState, useEffect } from "react";
import http from "../services/http";

export default function EditorDashboard() {
  const [stories, setStories] = useState([]);
  const [newStory, setNewStory] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch stories created by this editor
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await http.get("/api/stories/editor");
        setStories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStories();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newStory.title || !newStory.content) return alert("Please fill all fields");

    try {
      setLoading(true);
      await http.post("/api/stories", newStory);
      alert("Story submitted for admin review!");
      setNewStory({ title: "", content: "" });
    } catch (err) {
      console.error(err);
      alert("Error submitting story");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold mb-4 text-center">Editor Dashboard</h2>

      {/* --- New Story Form --- */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-xl font-bold mb-3">Add New Story</h3>

        <input
          type="text"
          placeholder="Story Title"
          className="border p-2 w-full mb-3 rounded"
          value={newStory.title}
          onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
        />
        <textarea
          placeholder="Story Content"
          className="border p-2 w-full mb-3 rounded h-32"
          value={newStory.content}
          onChange={(e) => setNewStory({ ...newStory, content: e.target.value })}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Story"}
        </button>
      </form>

      {/* --- Editor's Stories List --- */}
      <div>
        <h3 className="text-2xl font-bold mb-2">My Stories</h3>
        {stories.length === 0 ? (
          <p>No stories submitted yet.</p>
        ) : (
          <ul className="space-y-3">
            {stories.map((story) => (
              <li
                key={story._id}
                className="p-3 border rounded-lg bg-gray-50 flex justify-between"
              >
                <div>
                  <h4 className="font-semibold">{story.title}</h4>
                  <p className="text-sm text-gray-600">
                    Status:{" "}
                    <span
                      className={
                        story.status === "approved"
                          ? "text-green-600"
                          : story.status === "rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }
                    >
                      {story.status}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
