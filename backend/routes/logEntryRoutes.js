const express = require("express");
const router = express.Router();
const LogEntry = require("../models/LogEntry");
const Project = require("../models/Project");


router.post("/", async (req, res) => {
  try {
    const project = await Project.findById(req.body.project);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const logEntry = new LogEntry({
      project: project._id,
      project_name: project.name,
      technicians: req.body.technicians || [], 
      task_type: req.body.task_type,
      description: req.body.description,
      date_time: req.body.date_time ? new Date(req.body.date_time) : new Date(),
      related_ticket: req.body.related_ticket,
    });

    const savedEntry = await logEntry.save();
    res.status(201).json(savedEntry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const entries = await LogEntry.find();
    // res.json(entries);
     const withProjectNames = await Promise.all(
      entries.map(async (entry) => {
        const project = await Project.findById(entry.project);

        return {
          ...entry._doc,
          project_name: project ? project.name : entry.project_name, 
          // If project exists use latest name 
          // otherwise fallback to stored project_name
        };
      })
    );

    res.json(withProjectNames);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const entry = await LogEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Log entry not found" });
    res.json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.body.project);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const updated = await LogEntry.findByIdAndUpdate(
      req.params.id,
      {
        project: project._id,
        project_name: project.name,
        technicians: req.body.technicians || [], 
        task_type: req.body.task_type,
        description: req.body.description,
        date_time: new Date(req.body.date_time),
        related_ticket: req.body.related_ticket,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await LogEntry.findByIdAndDelete(req.params.id);
    res.json({ message: "Log entry deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id/rating", async (req, res) => {
  try {
    const { rating, feedback } = req.body;

    const updated = await LogEntry.findByIdAndUpdate(
      req.params.id,
      { rating, feedback },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Log entry not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
