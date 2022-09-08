const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, required: true, trim: true },

    status: { type: Boolean, required: true, default: true },
    plan: { type: String, required: true, default: "Basic" },
    auth: {
      token: { type: String },
      clientToken: { type: String },
      expires: { type: String },
    },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
