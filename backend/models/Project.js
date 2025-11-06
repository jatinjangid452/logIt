const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  manager: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  technicians: [{ type: String }] // New field
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
