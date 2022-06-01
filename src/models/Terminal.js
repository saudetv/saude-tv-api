const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

// const LocationSchema = new mongoose.Schema({
//   lat: { type: Number, required: true },
//   lng: { type: Number, required: true },
//   address: { type: String, required: true },
// });

const TerminalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  categories: { type: Array, requeired: true },
  description: { type: String },
  code: { type: Number },
  // location: LocationSchema,
  socialClass: { type: Array, required: true },
  operationDate: { type: Array },
  proportion: { type: Array },
  startHour: { type: String, required: true, default: "08:00" },
  endHour: { type: String, required: true, default: "18:00" },
  refreshTime: { type: String, required: true, default: "60" },
  // groups: { type: String, required:true },
  users: { type: String, required: true },
  specialty: { type: Array, required: true },
  displays: { type: String, required: true },
  file: { type: String },
  flow: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
  playlists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Playlist" }],
});

TerminalSchema.plugin(AutoIncrement, { inc_field: 'code' });

module.exports = mongoose.model("Terminal", TerminalSchema);
