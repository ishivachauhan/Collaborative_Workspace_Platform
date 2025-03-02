// models/Repository.js
const mongoose = require("mongoose");

const repositorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  visibility: { type: String, enum: ["private", "public"], default: "private" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  defaultBranch: { type: String, default: "main" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Repository", repositorySchema);
