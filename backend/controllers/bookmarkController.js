const Bookmark = require("../models/Bookmark");

exports.addBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.create({ user: req.user.id, story: req.params.storyId });
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


