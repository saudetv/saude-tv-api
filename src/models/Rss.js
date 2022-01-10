const mongoose = require("mongoose");

const RssSchema = new mongoose.Schema({
  name: { type: String },
  template: { type: Array },
});

module.exports = mongoose.model("Rss", RssSchema);