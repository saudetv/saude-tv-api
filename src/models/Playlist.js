const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const SubplaylistSchema = new mongoose.Schema({
  afterContents: { type: Number, required: true, default: 4 },
  contents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Content" }],
});
const PlaylistSchema = new mongoose.Schema(
  {
    name: { type: String },
    contents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Content" }],
    initialDate: { type: String },
    finalDate: { type: String },
    subPlaylist: [SubplaylistSchema],
    terminals: [{ type: Number, ref: "Terminal" }],
  },
  {
    timestamps: true,
  }
);

PlaylistSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Playlist", PlaylistSchema);
