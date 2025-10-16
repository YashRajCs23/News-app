const express = require("express");
const { auth, requireRole } = require("../middleware/authMiddleware");
const { getAdminStats, listPendingStories, moderateStory, upsertCategory, deleteCategory } = require("../controllers/adminController");

const router = express.Router();

router.get("/stats", auth(true), requireRole("admin"), getAdminStats);
router.get("/stories/pending", auth(true), requireRole("admin"), listPendingStories);
router.post("/stories/:id/moderate", auth(true), requireRole("admin"), moderateStory);
router.post("/categories", auth(true), requireRole("admin"), upsertCategory);
router.delete("/categories/:slug", auth(true), requireRole("admin"), deleteCategory);

module.exports = router;


