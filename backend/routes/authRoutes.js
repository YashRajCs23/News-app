const express = require("express");
const { body } = require("express-validator");
const { signup, login, me } = require("../controllers/authController");
const { auth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/signup",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("role").optional().isIn(["user", "editor", "admin"]),
  ],
  signup
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  login
);

router.get("/me", auth(true), me);

module.exports = router;
