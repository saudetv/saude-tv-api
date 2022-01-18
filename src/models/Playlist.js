const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema({
  categoryItems: { type: Array, required: true },
  filterItems: { type: Boolean },
  search: { type: String, required: true },
  layout: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: String, required: true },
  checkbox: { type: Boolean },
  checkbox2: { type: Boolean },
  name: { type: String, required: true },
});

module.exports = mongoose.model("Playlist", PlaylistSchema);
