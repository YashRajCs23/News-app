const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
  const category = req.query.category || "general";
  res.json({ articles: [{ id: "1", title: `Top ${category} news`, category }] });
});

router.get("/search", (req, res) => {
  const q = req.query.q || "";
  res.json({ articles: [{ id: "s1", title: `Result for ${q}` }] });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.json({ id, title: `Story #${id}` });
});

module.exports = router;


