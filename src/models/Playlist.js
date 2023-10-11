const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const PlaylistSchema = new mongoose.Schema(
  {
    name: { type: String },
    contents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Content" }],
    initialDate: { type: String },
    finalDate: { type: String },
    terminals: [{ type: Number, ref: "Terminal" }],
  },
  {
    timestamps: true,
  }
);

PlaylistSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Playlist", PlaylistSchema);
