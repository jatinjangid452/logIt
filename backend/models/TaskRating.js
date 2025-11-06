// models/TaskRating.js
const mongoose = require("mongoose");

const taskRatingSchema = new mongoose.Schema({
  log_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LogEntry",
    required: true
  },
  rater_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  rating_value: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comments: {
    type: String,
    trim: true
  },
  rated_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("TaskRating", taskRatingSchema);
