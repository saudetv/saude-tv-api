const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  address: { type: String, required: true },
});

const TerminalSchema = new mongoose.Schema({
  users: { type: String, required: true },
  displays: { type: String, required: true },
  name: { type: String, required: true },
  operationDate: { type: Array, requeired: true },
  proportion: { type: Array, requeired: true },
  categories: { type: Array, requeired: true },
  groups: { type: Array, requeired: true },
  description: { type: String },
  location: LocationSchema,
  socialClass: { type: Array, required: true },
  // operationDate: { type: Array },
  // proportion: { type: String },
  timeRange: { type: String, required: true },
  photos: { type: Array },
  model: { type: Array, requeired: true },
  flow: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Terminal", TerminalSchema);
