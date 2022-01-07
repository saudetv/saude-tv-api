const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  duration: { type: String, required: true },
  fileName: { type: String, required: true },
  categories: { type: Array, required: true },
  startDate: { type: Date, default: Date.now() },
  days: { type: Array, required: true },
  clientName: { type: String, required: true },
  agencyItems: { type: Array, required: true },
  customerItems: { type: Array, required: true },
});

module.exports = mongoose.model("Content", ContentSchema);
