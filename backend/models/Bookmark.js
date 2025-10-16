const mongoose = require("mongoose");

const BookmarkSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    story: { type: mongoose.Schema.Types.ObjectId, ref: "Story", required: true },
  },
  { timestamps: true }
);

BookmarkSchema.index({ user: 1, story: 1 }, { unique: true });

module.exports = mongoose.model("Bookmark", BookmarkSchema);


