const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ContentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    file: { type: String },
    fileSize: { type: Number },
    thumbnail: { type: String },
    initialDate: { type: String },
    finalDate: { type: String },
    url: { type: String },
    duration: { type: Number },
    logo: { type: String },
    status: { type: Boolean, default: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    rss: [
      {
        title: { type: Array },
        description: { type: Array },
        link: { type: Array },
        pubDate: { type: Array },
        category: { type: Array },
        "media:content": { type: Array },
        "content:encoded": { type: Array },
        guid: { type: Array },
      },
    ],
    type: {
      type: String,
      enum: ["RSS", "VIDEO", "INSTAGRAM"],
      default: "VIDEO",
    },
    states: [{ type: String }],
    regions: [{ type: String }],
    terminals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Terminal" }],
  },
  {
    timestamps: true,
  }
);

ContentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Content", ContentSchema);
