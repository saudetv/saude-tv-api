const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema({
  adMessager: { type: String, required: true },
  adDescription: { type: String },
});

module.exports = mongoose.model("Playlist", PlaylistSchema);
