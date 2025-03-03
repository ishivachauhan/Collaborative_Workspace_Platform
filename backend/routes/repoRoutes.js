// routes/repoRoutes.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Repository = require("../models/repository");
const File = require("../models/file"); // ✅ Ensure File model is imported
const authMiddleware = require("../middleware/auth");

// ✅ Create a New Repository
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description, visibility } = req.body;

    // Create repository with the authenticated user as owner
    const repository = new Repository({
      name,
      description,
      visibility,
      owner: req.user.id,
    });

    await repository.save();
    res.status(201).json(repository);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create repository", error: error.message });
  }
});

// ✅ Get User's Repositories
router.get("/my-repos", authMiddleware, async (req, res) => {
  try {
    const repositories = await Repository.find({ owner: req.user.id })
      .populate("owner", "username")
      .exec();
    res.status(200).json(repositories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch repositories", error: error.message });
  }
});

// ✅ Get a Repository by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid repository ID" });
    }

    const repo = await Repository.findById(req.params.id).populate(
      "owner",
      "username email"
    );
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }
    res.json(repo);
  } catch (error) {
    console.error("Error fetching repository:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Push Code (Save File)
router.post("/:id/push", authMiddleware, async (req, res) => {
  try {
    const { filename, content } = req.body;

    if (!filename || !content) {
      return res.status(400).json({ message: "Filename and content required" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid repository ID" });
    }

    const repo = await Repository.findById(req.params.id);
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    // ✅ Save file to database
    const newFile = new File({
      filename,
      content,
      repository: req.params.id,
      createdAt: new Date(),
    });

    await newFile.save();
    res
      .status(201)
      .json({ message: "File pushed successfully", file: newFile });
  } catch (error) {
    console.error("Error pushing file:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Fetch All Pushed Files for a Repository
router.get("/:id/files", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid repository ID" });
    }

    const files = await File.find({ repository: req.params.id });
    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Pull Latest Code (Dummy Function)
router.post("/:id/pull", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid repository ID" });
    }

    const repo = await Repository.findById(req.params.id);
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    console.log(`Pulling latest code for repo ${repo.name}...`);
    res.status(200).json({ message: "Latest code pulled successfully" });
  } catch (error) {
    console.error("Error pulling code:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete Repository
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid repository ID" });
    }

    const repo = await Repository.findByIdAndDelete(req.params.id);
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    res.status(200).json({ message: "Repository deleted successfully" });
  } catch (error) {
    console.error("Error deleting repository:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete a File from Repository
router.delete("/:repoId/files/:fileId", authMiddleware, async (req, res) => {
  try {
    const { repoId, fileId } = req.params;

    // Validate IDs
    if (
      !mongoose.Types.ObjectId.isValid(repoId) ||
      !mongoose.Types.ObjectId.isValid(fileId)
    ) {
      return res.status(400).json({ message: "Invalid repository or file ID" });
    }

    const file = await File.findByIdAndDelete(fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
