const mongoose = require("mongoose");
const requireDir = require("require-dir");

module.exports = {
  async connect() {
    console.log(process.env.MONGO_DB_URL, " -<<<<<<<<<<<<<<< process.env.MONGO_DB_URL");
    mongoose.connect(process.env.MONGO_DB_URL, {});
  },
};
