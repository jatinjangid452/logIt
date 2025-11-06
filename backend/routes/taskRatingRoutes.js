// routes/taskRatingRoutes.js
const express = require("express");
const router = express.Router();
const TaskRating = require("../models/TaskRating");
const LogEntry = require("../models/LogEntry");

// ✅ Create rating for a log
router.post("/", async (req, res) => {
  try {
    const { log_id, rater_id, rating_value, comments } = req.body;

    const rating = new TaskRating({
      log_id,
      rater_id,
      rating_value,
      comments
      // rated_at will be automatically set
    });

    const saved = await rating.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const ratings = await TaskRating.find();
    res.json(ratings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
// ✅ Get rating by log ID
router.get("/log/:log_id", async (req, res) => {
  try {
    const ratings = await TaskRating.find({ log_id: req.params.log_id });
    res.json(ratings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update rating (optional)
router.put("/:id", async (req, res) => {
  try {
    const updated = await TaskRating.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Rating not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete rating
router.delete("/:id", async (req, res) => {
  try {
    await TaskRating.findByIdAndDelete(req.params.id);
    res.json({ message: "Rating deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
