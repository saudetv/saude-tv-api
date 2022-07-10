const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema(
  {
    name: { type: String },
    contents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Content" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Playlist", PlaylistSchema);
