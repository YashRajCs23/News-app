import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ReviewStory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/stories/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setStory(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [id]);

  const handleAction = async (action) => {
    try {
      await axios.put(
        `http://localhost:5000/api/stories/${id}/review`,
        { status: action },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert(`Story ${action} successfully!`);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error updating story status");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!story) return <p className="text-center mt-10">Story not found</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded-lg">
      <h2 className="text-3xl font-bold mb-3">{story.title}</h2>
      <p className="text-gray-700 mb-6">{story.content}</p>

      <div className="flex gap-4">
        <button
          onClick={() => handleAction("approved")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Approve
        </button>
        <button
          onClick={() => handleAction("rejected")}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
