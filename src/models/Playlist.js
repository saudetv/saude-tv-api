const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  saveasName: { type: String, required: true },
  duration: { type: String, required: true },
  categories: { type: Array, required: true },
  newsQuantity: { type: String },
  carouselQuantity: { type: String },
  layoutQuantity: { type: String },
  videowallQuantity: { type: String },
  search: { type: String },
  carouselSearch: { type: String },
  layoutSearch: { type: String },
  layout: { type: Array },
  layoutDescription: { type: String },
  description: { type: String },
  addPlaylistCardsImage: { type: String },
  addPlaylistCardsName: { type: String, required: true },
  addPlaylistCardsDuration: { type: String },
  addPlaylistCardsCounter: { type: String },
  cardTypeMedia: { type: String },
  cardTypeCarousel: { type: String },
  cardTypeNews: { type: String },
  cardDate: { type: String, required: true },
  cardLoops: { type: String, required: true },
  cardTimer: { type: String, required: true },
});

module.exports = mongoose.model("Playlist", PlaylistSchema);
