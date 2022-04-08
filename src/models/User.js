const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  type: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now() },
  status: { type: Boolean, required: true, default: true },
  plan: { type: String, required: true, default: "Basic" },
  auth: {
    token: { type: String },
    expires: { type: String },
  },
  terminals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Terminal" }],
});

module.exports = mongoose.model("User", UserSchema);
