const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema(
  {
    entity: { type: String },
    route: { type: String },
    agent: { type: String },
    ip: { type: String },
    response: { type: Object },
    body: { type: Object },
    method: { type: String },
    id: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Log", LogSchema);
