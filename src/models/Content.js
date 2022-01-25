const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  duration: { type: String, required: true },
  file: { type: String, required: true },
  categories: { type: Array, required: true },
  startDate: { type: Date, default: Date.now() },
  days: { type: Array, required: true },
  agencies: { type: Array, required: true },
  customers: { type: Array, required: true },
});

module.exports = mongoose.model("Content", ContentSchema);
