const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  long: { type: Number, required: true },
  address: { type: String, required: true },
});

const TerminalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  categories: { type: Array, requeired: true },
  tags: { type: Array },
  description: { type: String },
  location: LocationSchema,
  socialClass: { type: Array, required: true },
  speciality: { type: Array, required: true },
  resolution: { type: String, required: true },
  timeRange: { type: String, required: true },
  photo: { type: String },
  flow: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Terminal", TerminalSchema);
