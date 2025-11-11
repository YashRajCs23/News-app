const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
// Load environment variables early
require("dotenv").config();
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/db");

const app = express();
app.set("trust proxy", 1);
// Middleware
// Security middlewares
app.use(helmet());
app.use(compression());
app.use(cookieParser());

// Configure CORS to allow only the configured origin in production
const allowedOrigin = process.env.FRONTEND_URL || process.env.VITE_API_URL || "http://localhost:5173";
app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Basic rate limiting to protect public endpoints
app.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 120, // limit each IP to 120 requests per windowMs
  })
);

app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
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

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const clientDist = path.join(process.cwd(), "frontend", "dist");
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.get("/", (_req, res) => res.sendFile(path.join(clientDist, "index.html")));
    // All other non-api routes should serve the SPA
    app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(clientDist, "index.html")));
  } else {
    console.warn("Production build not found at frontend/dist — make sure to run frontend build before starting in production.");
  }
}

// app.use ("*", (req, res) => {

// })

const PORT = process.env.PORT || 5000;
connectDB(
  process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/news-app"
)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect DB", err);
    process.exit(1);
  });
