// src/components/StoryForm.jsx
import React, { useState } from "react";

const StoryForm = ({ onSubmit, initialData = {}, isEditing = false }) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [content, setContent] = useState(initialData.content || "");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required!");
      return;
    }

    const storyData = {
      title: title.trim(),
      description: description.trim(),
      content: content.trim(),
    };

    onSubmit(storyData);
    setError("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        {isEditing ? "Edit Story" : "Submit a New Story"}
      </h2>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <div className="mb-4">
        <label className="block text-gray-700 mb-1 font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Enter story title"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1 font-medium">
          Description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          placeholder="Short summary (optional)"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-1 font-medium">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 min-h-[150px]"
          placeholder="Write your story here..."
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
      >
        {isEditing ? "Update Story" : "Submit Story"}
      </button>
    </form>
  );
};

export default StoryForm;
