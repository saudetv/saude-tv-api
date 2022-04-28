const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  file: { type: Array, required: true },
  categories: { type: Array, required: true },
  startDate: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Content", ContentSchema);
