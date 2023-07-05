const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const mongoosePaginate = require("mongoose-paginate-v2");

const LocationSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
});

const TerminalSchema = new mongoose.Schema(
  {
    _id: { type: Number },
    name: { type: String, required: true },
    categories: { type: Array, requeired: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["on", "off", "issued"],
      default: "off",
    },
    location: LocationSchema,
    socialClass: { type: Array, required: true },
    operationDate: { type: Array },
    proportion: { type: Array },
    startHour: { type: String, required: true, default: "08:00" },
    endHour: { type: String, required: true, default: "18:00" },
    refreshTime: { type: String, required: true, default: "300" },
    specialty: { type: Array, required: true },
    displays: { type: String, required: true },
    file: { type: String },
    flow: { type: String, required: true },
    contents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Content" }],
    appVersion: { type: String },
    updated: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

TerminalSchema.plugin(AutoIncrement, { inc_field: "_id" });

TerminalSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Terminal", TerminalSchema);
