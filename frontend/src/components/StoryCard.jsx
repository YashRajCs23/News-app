import React from "react";
import { formatDate } from "../utils/formatDate";

const StoryCard = ({ story, onApprove, onReject, showActions = false }) => {
  if (!story) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4 transition hover:shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-1">{story.title}</h2>

      <p className="text-sm text-gray-500 mb-2">
        By {story.author || "Unknown"} • {formatDate(story.createdAt)}
      </p>

      <p className="text-gray-700 mb-3">
        {story.description || story.content?.slice(0, 120) + "..."}
      </p>

      {story.status && (
        <p
          className={`text-sm font-medium ${
            story.status === "approved"
              ? "text-green-600"
              : story.status === "rejected"
              ? "text-red-600"
              : "text-yellow-600"
          }`}
        >
          Status: {story.status.charAt(0).toUpperCase() + story.status.slice(1)}
        </p>
      )}

      {showActions && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => onApprove && onApprove(story)}
            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition"
          >
            Approve
          </button>
          <button
            onClick={() => onReject && onReject(story)}
            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default StoryCard;
