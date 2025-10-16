const ManageStories = ({ stories = [], refresh }) => {
  const handleAction = async (id, action) => {
    try {
      const { moderateStory } = await import("../services/adminService");
      await moderateStory(id, action);
      refresh();
    } catch (err) {
      console.error("Error updating story:", err);
    }
  };

  if (stories.length === 0)
    return (
      <p className="text-center text-yellow-400">
        No stories available in this category.
      </p>
    );

  return (
    <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] max-w-[1200px] mx-auto">
      {stories.map((story) => (
        <div
          key={story._id}
          className="bg-slate-900 p-5 rounded-xl shadow-lg shadow-teal-500/20 hover:scale-[1.02] transition-transform"
        >
          <h3 className="text-xl text-teal-400 font-bold">{story.title}</h3>
          <p className="text-sm text-slate-400 mt-2">{story.description}</p>

          <div className="flex justify-between mt-4">
            {story.status === "pending" && (
              <>
                <button
                  onClick={() => handleAction(story._id, "approve")}
                  className="bg-green-500 text-black px-3 py-1 rounded hover:bg-green-400"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(story._id, "reject")}
                  className="bg-red-500 text-black px-3 py-1 rounded hover:bg-red-400"
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageStories;