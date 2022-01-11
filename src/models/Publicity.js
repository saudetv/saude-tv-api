const mongoose = require("mongoose");

const PublicitySchema = new mongoose.Schema({
  adMessager: { type: String, required: true },
  adDescription: { type: String },
});

module.exports = mongoose.model("Publicity", PublicitySchema);
