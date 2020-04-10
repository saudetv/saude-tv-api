const mongoose = require("mongoose");
const requireDir = require("require-dir");

module.exports = {
    async connect() {
        mongoose.connect("mongodb+srv://hermod:hermod123@hermod-ncck5.mongodb.net/test?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        requireDir("../models");
    }
};
