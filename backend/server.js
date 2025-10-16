const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();
const { connectDB } = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
const uploadsDir = path.join(process.cwd(), "backend", "uploads");
const fs = require("fs");
try {
  fs.mkdirSync(uploadsDir, { recursive: true });
} catch (e) {
  console.error("Failed to create uploads directory:", e);
}
app.use("/uploads", express.static(uploadsDir));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Routes
const storyRoutes = require("./routes/storyRoutes");
const newsRoutes = require("./routes/newsRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");

app.use("/api/stories", storyRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

// Fallback for unknown API routes
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "Not Found" });
  }
  next();
});

const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/news-app")
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect DB", err);
    process.exit(1);
  });


