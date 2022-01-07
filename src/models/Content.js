const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model("Content", ContentSchema);
