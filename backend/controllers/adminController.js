const Story = require("../models/Story");
const Category = require("../models/Category");
const User = require("../models/User");

async function getAdminStats(_req, res) {
  try {
    const [users, stories, approved, pending, rejected, categories] = await Promise.all([
      User.countDocuments(),
      Story.countDocuments(),
      Story.countDocuments({ status: "approved" }),
      Story.countDocuments({ status: "pending" }),
      Story.countDocuments({ status: "rejected" }),
      Category.countDocuments(),
    ]);
    res.json({ users, stories, approved, pending, rejected, categories });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
}

async function listPendingStories(_req, res) {
  try {
    const stories = await Story.find({ status: "pending" }).populate("category").populate("author", "name email");
    res.json(stories);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
}

async function moderateStory(req, res) {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });
    const { action } = req.body; // approve | reject
    if (!["approve", "reject"].includes(action)) return res.status(400).json({ message: "Invalid action" });
    story.status = action === "approve" ? "approved" : "rejected";
    // record which admin reviewed this story and when
    if (req.user && req.user.id) {
      story.reviewedBy = req.user.id;
      story.reviewedAt = new Date();
    }
    await story.save();
    // populate reviewer before returning
    await story.populate("reviewedBy", "name email").execPopulate?.();
    res.json(story);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
}

async function upsertCategory(req, res) {
  try {
    const { name, slug } = req.body;
    if (!name || !slug) return res.status(400).json({ message: "Missing fields" });
    const cat = await Category.findOneAndUpdate({ slug }, { name, slug }, { upsert: true, new: true, setDefaultsOnInsert: true });
    res.status(201).json(cat);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteCategory(req, res) {
  try {
    await Category.findOneAndDelete({ slug: req.params.slug });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { getAdminStats, listPendingStories, moderateStory, upsertCategory, deleteCategory };


