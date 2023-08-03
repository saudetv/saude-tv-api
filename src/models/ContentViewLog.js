const mongoose = require("mongoose");

const ContentViewLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: mongoose.Schema.Types.ObjectId, ref: "Content" },
    terminal: { type: Number, ref: "Terminal" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ContentViewLog", ContentViewLogSchema);
