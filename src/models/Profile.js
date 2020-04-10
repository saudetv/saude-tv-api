const mongoose = require("mongoose");

const ProfileModuleSchema = new mongoose.Schema(
  {
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
    actions: {
      index: { type: Boolean, required: true, default: false },
      store: { type: Boolean, required: true, default: false },
      edit: { type: Boolean, required: true, default: false },
      view: { type: Boolean, required: true, default: false },
      delete: { type: Boolean, required: true, default: false }
    }
  },
  { _id: false }
);
const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  profileModule: [ProfileModuleSchema],
  createdAt: { type: Date, default: Date.now() },
  status: { type: Boolean, required: true, default: true }
});

mongoose.model("Profile", ProfileSchema);
