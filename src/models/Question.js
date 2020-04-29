const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  type: { type: String, enum: ['text', 'password', 'submit', 'reset', 'radio', 'checkbox', 'button', 'file', 'image'], required: true },
  options: [{ type: Array }]
});

module.exports = mongoose.model("Question", QuestionSchema);
