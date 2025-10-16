const express = require("express");
const { auth } = require("../middleware/authMiddleware");
const { addBookmark, removeBookmark, getMyBookmarks } = require("../controllers/bookmarkController");

const router = express.Router();

router.post("/:storyId", auth(true), addBookmark);
router.delete("/:storyId", auth(true), removeBookmark);
router.get("/me/list", auth(true), getMyBookmarks);

module.exports = router;


