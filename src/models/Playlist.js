const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  duration: { type: String, required: true },
  categories: { type: Array, required: true },
  newsQuantity: { type: String, required: true },
  carouselQuantity: { type: String, required: true },
  layoutQuantity: { type: String, required: true },
  videowallQuantity: { type: String, required: true },
  search: { type: String },
  carouselSearch: { type: String },
  layoutSearch: { type: String },
  layout: { type: Array, required: true },
  layoutDescription: { type: String },
  description: { type: String },
});

module.exports = mongoose.model("Playlist", PlaylistSchema);
