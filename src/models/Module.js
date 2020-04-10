const mongoose = require("mongoose");

const ModuleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  route: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now() },
  status: { type: Boolean, required: true, default: true }
});

mongoose.model("Module", ModuleSchema);
