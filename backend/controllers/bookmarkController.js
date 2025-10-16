const Bookmark = require("../models/Bookmark");
const NewsBookmark = require("../models/NewsBookmark");
const mongoose = require("mongoose");

exports.addBookmark = async (req, res) => {
  try {
    const storyId = req.params.storyId;
    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      return res.status(400).json({ message: "Invalid story id" });
    }
    const bookmark = await Bookmark.create({ user: req.user.id, story: storyId });
    res.status(201).json(bookmark);
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: "Already bookmarked" });
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeBookmark = async (req, res) => {
  try {
    await Bookmark.findOneAndDelete({ user: req.user.id, story: req.params.storyId });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.id }).populate({ path: "story", populate: { path: "category" } });
    res.json(bookmarks);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

// News bookmarks (external articles by URL)
exports.addNewsBookmark = async (req, res) => {
  try {
    const { url, title, sourceName, imageUrl } = req.body || {};
    if (!url) return res.status(400).json({ message: "url is required" });
    const userId = req.user?._id || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const normalizedUrl = String(url).trim();
    const updated = await NewsBookmark.findOneAndUpdate(
      { user: userId, url: normalizedUrl },
      { $setOnInsert: { user: userId, url: normalizedUrl }, $set: { title, sourceName, imageUrl } },
      { upsert: true, new: true }
    );
    res.status(201).json(updated);
  } catch (e) {
    console.error("addNewsBookmark error:", e);
    if (e.code === 11000) return res.status(409).json({ message: "Already bookmarked" });
    res.status(500).json({ message: "Server error", details: e?.message });
  }
};

exports.removeNewsBookmark = async (req, res) => {
  try {
    const url = req.query.url || req.body?.url;
    if (!url) return res.status(400).json({ message: "url is required" });
    const userId = req.user?._id || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    await NewsBookmark.findOneAndDelete({ user: userId, url: String(url).trim() });
    res.json({ ok: true });
  } catch (e) {
    console.error("removeNewsBookmark error:", e);
    res.status(500).json({ message: "Server error", details: e?.message });
  }
};

exports.getMyNewsBookmarks = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const bookmarks = await NewsBookmark.find({ user: userId }).sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (e) {
    console.error("getMyNewsBookmarks error:", e);
    res.status(500).json({ message: "Server error", details: e?.message });
  }
};

