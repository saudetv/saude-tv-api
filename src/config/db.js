const mongoose = require("mongoose");
const requireDir = require("require-dir");

module.exports = {
  async connect() {
    await mongoose.connect(process.env.MONGO_DB_URL, {});
    requireDir("../models");
  },
};
