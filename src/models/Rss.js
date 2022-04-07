const mongoose = require("mongoose");

const RssSchema = new mongoose.Schema({
  // notificationSender: { type: String },
  // email: { type: String },
  // emailInsert: { type: String },
  // emailApprove: { type: String },
  // emailRepprove: { type: String },
  name: { type: String, required: true },
  url: { type: String, required: true },
  // nameRss: { type: String, required: true },
  // informativeText: { type: String },
  // selectChannel: { type: Array },
  // typeChannel: { type: String },
  // acTemplate: { type: Array, required: true },
  // viewingArea: { type: Array, required: true },
  // textCapture: { type: String },
  // imageCapture: { type: Array },
  // inadequateTerms: { type: String },
  // registerLimits: { type: String },
  // newsDuration: { type: String },
  // itemsWeight: { type: Array },
});

module.exports = mongoose.model("Rss", RssSchema);