const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema(
  {
    name: { type: String },
    contents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Content" }],
    initialDate: { type: String },
    finalDate: { type: String },
    terminals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Terminal" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Playlist", PlaylistSchema);
