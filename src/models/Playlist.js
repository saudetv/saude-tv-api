const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  contents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Content" }],
});

module.exports = mongoose.model("Playlist", PlaylistSchema);
