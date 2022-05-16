const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  file: { type: String, required: true },
  categories: { type: Array, required: true },
  initialDate: { type: String, required: true },
  finalDate: { type: String, required: true },
});

module.exports = mongoose.model("Content", ContentSchema);
