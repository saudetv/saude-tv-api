const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  address: { type: String, required: true },
});

const TerminalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Playlist" }],
  categories: { type: Array, requeired: true },
  description: { type: String },
  location: LocationSchema,
  socialClass: { type: Array, required: true },
  operationDate: { type: Array },
  proportion: { type: String },
  timeRange: { type: String, required: true },
  groups: { type: String, required:true },
  users: { type: String, required:true },
  specialty: { type: Array, required:true },
  displays: { type: String, required:true },
  file: { type: String },
  flow: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Terminal", TerminalSchema);
