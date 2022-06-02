const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  file: { type: String },
  thumbnail: { type: String },
  initialDate: { type: String },
  finalDate: { type: String },
  url: { type: String },
  rss: [{
    title: { type: Array },
    description: { type: Array },
    link: { type: Array },
    pubDate: { type: Array },
    category: { type: Array },
    "media:content": { type: Array },
    "content:encoded": { type: Array },
    guid: { type: Array }
  }],
  type: { type: String, enum: ['RSS', 'VIDEO'], default: 'VIDEO' }
},
  {
    timestamps: true
  });

module.exports = mongoose.model("Content", ContentSchema);
