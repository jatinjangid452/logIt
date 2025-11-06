const mongoose = require("mongoose");

const logEntrySchema = new mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  project_name: { type: String, required: true },
  technicians: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  task_type: { type: String, enum: ["Incident", "Maintenance", "Update"], required: true },
  description: { type: String, required: true },
  date_time: { type: Date, required: true },
  related_ticket: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  feedback: { type: String }
});

module.exports = mongoose.model("LogEntry", logEntrySchema);
