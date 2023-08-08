const mongoose = require("mongoose");
const LocationSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
});
const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ["customer", "franchisee", "admin", "technician"],
      default: "customer",
    },
    status: { type: Boolean, required: true, default: true },
    plan: { type: String, required: true, default: "Basic" },
    location: LocationSchema,
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
