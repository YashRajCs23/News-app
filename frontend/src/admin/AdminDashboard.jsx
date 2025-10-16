import { useEffect, useState } from "react";
import ManageStories from "./ManageStories";
import { getPendingStories } from "../services/adminService";
import http from "../services/http";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [stories, setStories] = useState([]);

  useEffect(() => {
    // Fetch stories (pending/approved)
    const fetchStories = async () => {
      try {
        if (activeTab === "pending") {
          const data = await getPendingStories();
          setStories(data);
        } else {
          const res = await http.get(`/api/stories`, { params: { status: activeTab } });
          setStories(res.data);
        }
      } catch (err) {
        console.error("Error fetching stories:", err);
      }
    };

    fetchStories();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-black text-slate-200 px-5 py-8 font-['Orbitron']">
      <h1 className="text-3xl text-teal-500 font-bold text-center mb-6">
        Admin Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-5 mb-8">
        {["pending", "approved", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg ${
              activeTab === tab
                ? "bg-teal-500 text-black"
                : "bg-slate-800 hover:bg-slate-700"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Manage Stories */}
      <ManageStories stories={stories} refresh={() => setActiveTab(activeTab)} />
    </div>
  );
};

export default AdminDashboard;
