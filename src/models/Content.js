const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  file: { type: String },
  categories: { type: Array, required: true },
  initialDate: { type: String },
  finalDate: { type: String },  
  url: { type: String },
  type: { type: String, enum: ['RSS', 'VIDEO'], default: 'VIDEO'}
});

module.exports = mongoose.model("Content", ContentSchema);
