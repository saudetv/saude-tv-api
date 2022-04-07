const mongoose = require("mongoose");

const InstagramSchema = new mongoose.Schema({
  name: { type: String, required: true },
  instagram: { type: String, required: true },
});

module.exports = mongoose.model("Instagram", InstagramSchema);