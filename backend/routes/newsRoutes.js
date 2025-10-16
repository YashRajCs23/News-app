const express = require("express");
const axios = require("axios");
const router = express.Router();

const NEWS_API_KEY = "343150d47242485d914a0b44b58a921e";
const NEWS_API_BASE_URL = "https://newsapi.org/v2";

router.get("/", async (req, res) => {
  try {
    const category = req.query.category || "general";
    const response = await axios.get(`${NEWS_API_BASE_URL}/top-headlines`, {
      params: {
        country: "us",
        category: category,
        apiKey: NEWS_API_KEY
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching news:", error.message);
    res.status(500).json({ 
      error: "Failed to fetch news",
      message: error.message 
    });
  }
});

router.get("/search", async (req, res) => {
  try {
    const q = req.query.q || "";
    const response = await axios.get(`${NEWS_API_BASE_URL}/everything`, {
      params: {
        q: q,
        apiKey: NEWS_API_KEY,
        sortBy: "publishedAt",
        pageSize: 20
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error("Error searching news:", error.message);
    res.status(500).json({ 
      error: "Failed to search news",
      message: error.message 
    });
  }
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.json({ id, title: `Story #${id}` });
});

module.exports = router;


