const express = require("express");
const router = express.Router();

const { login, signup, me } = require("../controllers/userController");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", me);

module.exports = router;


