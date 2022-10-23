const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ContentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    file: { type: String },
    thumbnail: { type: String },
    initialDate: { type: String },
    finalDate: { type: String },
    url: { type: String },
    duration: { type: Number },
    logo: { type: String },
    status: { type: Boolean, default: true },
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
  },
  {
    timestamps: true,
  }
);

ContentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Content", ContentSchema);
