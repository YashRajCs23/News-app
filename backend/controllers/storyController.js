const Story = require("../models/Story");
const Category = require("../models/Category");

async function getAllStories(req, res) {
  try {
    const filter = {};
    // If admin requests, allow filtering by status; otherwise only approved
    if (req.user && req.user.role === "admin") {
      if (req.query.status && ["pending", "approved", "rejected"].includes(req.query.status)) {
        filter.status = req.query.status;
      }
    } else {
      filter.status = "approved";
    }
    if (req.query.category) {
      const cat = await Category.findOne({ slug: req.query.category });
      if (cat) filter.category = cat._id;
    }
    const stories = await Story.find(filter)
      .populate("category")
      .populate("author", "name email")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(stories);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
}

async function createStory(req, res) {
  try {
    let categoryId = req.body.category;
    if (!categoryId) {
      let general = await Category.findOne({ slug: "general" });
      if (!general) {
        general = await Category.create({ name: "General", slug: "general" });
      }
      categoryId = general._id;
    } else {
      const mongoose = require("mongoose");
      let exists = null;
      if (mongoose.Types.ObjectId.isValid(String(categoryId))) {
        exists = await Category.findById(categoryId);
      }
      if (!exists) {
        exists = await Category.findOne({ slug: String(categoryId).toLowerCase() });
      }
      if (!exists) return res.status(400).json({ message: "Invalid category" });
      categoryId = exists._id;
    }
    const story = await Story.create({
      title: req.body.title,
      content: req.body.content,
      category: categoryId,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl || "",
      status: "pending",
      author: req.user.id,
    });
    res.status(201).json(story);
  } catch (e) {
    console.error("createStory error:", e);
    res.status(500).json({ message: "Server error", details: e.message });
  }
}

async function getStoryById(req, res) {
  try {
    const story = await Story.findById(req.params.id)
      .populate("category")
      .populate("author", "name email")
      .populate("reviewedBy", "name email");
    if (!story) return res.status(404).json({ message: "Story not found" });
    if (story.status !== "approved" && (!req.user || (req.user.id !== String(story.author) && req.user.role !== "admin"))) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.json(story);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
}

async function updateStory(req, res) {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });
    if (req.user.role !== "admin" && req.user.id !== String(story.author)) return res.status(403).json({ message: "Forbidden" });
    story.title = req.body.title ?? story.title;
    story.content = req.body.content ?? story.content;
    if (req.body.category) story.category = req.body.category;
    if (req.file) story.imageUrl = `/uploads/${req.file.filename}`;
    if (req.body.status && ["pending", "approved", "rejected"].includes(req.body.status)) story.status = req.body.status;
    await story.save();
    res.json(story);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteStory(req, res) {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });
    if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
    await story.deleteOne();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { getAllStories, createStory, getStoryById, updateStory, deleteStory };


