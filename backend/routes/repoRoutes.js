// routes/repoRoutes.js
const express = require("express");
const router = express.Router();
const Repository = require("../models/repository");
const authMiddleware = require("../middleware/auth");

// Create a new repository
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description, visibility } = req.body;

    // Create the repository
    const repository = new Repository({
      name,
      description,
      visibility,
      owner: req.user.id, // Attach the owner (user ID from auth middleware)
    });

    await repository.save();

    res.status(201).json(repository);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create repository", error: error.message });
  }
});

router.get("/my-repos", authMiddleware, async (req, res) => {
  try {
    const repositories = await Repository.find({ owner: req.user.id });
    res.status(200).json(repositories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch repositories", error: error.message });
  }
});

module.exports = router;
