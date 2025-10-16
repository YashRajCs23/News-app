const express = require("express");
const { auth } = require("../middleware/authMiddleware");
const { addBookmark, removeBookmark, getMyBookmarks, addNewsBookmark, removeNewsBookmark, getMyNewsBookmarks } = require("../controllers/bookmarkController");

const router = express.Router();

router.post("/news", auth(true), addNewsBookmark); // expects { url, title?, sourceName?, imageUrl? }
router.delete("/news", auth(true), removeNewsBookmark); // expects ?url=... or { url }
router.get("/news/me/list", auth(true), getMyNewsBookmarks);

router.post("/:storyId", auth(true), addBookmark);
router.delete("/:storyId", auth(true), removeBookmark);
router.get("/me/list", auth(true), getMyBookmarks);

module.exports = router;