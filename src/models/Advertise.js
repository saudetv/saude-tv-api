const mongoose = require("mongoose");

const AdvertiseSchema = new mongoose.Schema({
  adMessager: { type: String, required: true },
  adDescription: { type: String },
});

module.exports = mongoose.model("Advertise", AdvertiseSchema);
