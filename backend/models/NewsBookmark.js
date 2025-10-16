const mongoose = require("mongoose");

const NewsBookmarkSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    url: { type: String, required: true },
    title: { type: String },
    sourceName: { type: String },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

NewsBookmarkSchema.index({ user: 1, url: 1 }, { unique: true });

module.exports = mongoose.model("NewsBookmark", NewsBookmarkSchema);



