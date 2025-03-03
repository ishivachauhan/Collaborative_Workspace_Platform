const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Register route
router.post("/register", authController.register);

// Login route
router.post("/login", authController.login);

router.get("/user", authMiddleware, authController.dashboard_user);
router.get("/user", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
