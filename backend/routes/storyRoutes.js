const express = require("express");
const multer = require("multer");
const path = require("path");
const { auth, requireRole } = require("../middleware/authMiddleware");
const { getAllStories, createStory, getStoryById, updateStory, deleteStory } = require("../controllers/storyController");

const router = express.Router();

// Multer local upload (can be swapped with Cloudinary)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(process.cwd(), "backend", "uploads")),
  filename: (_req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

router.get("/", auth(false), getAllStories);
router.post("/", auth(true), requireRole("editor", "admin"), upload.single("image"), createStory);
router.get("/editor", auth(true), requireRole("editor", "admin"), async (req, res) => {
  const Story = require("../models/Story");
  try {
    const list = await Story.find({ author: req.user.id }).sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/:id", auth(false), getStoryById);
router.put("/:id", auth(true), upload.single("image"), updateStory);
router.delete("/:id", auth(true), requireRole("admin"), deleteStory);

module.exports = router;


