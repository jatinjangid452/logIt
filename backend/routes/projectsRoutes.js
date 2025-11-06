const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().populate("technicians", "name email role"); // populate technician info
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Get single project by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("technicians", "name email role");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Add a project
router.post("/", async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: "Failed to create project", error: err });
  }
});

// Update a project
router.put("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: "Failed to update project", error: err });
  }
});

// Delete a project
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
