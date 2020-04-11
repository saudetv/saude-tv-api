const mongoose = require("mongoose");
const requireDir = require("require-dir");

module.exports = {
    async connect() {
        mongoose.connect("mongodb+srv://bora:bora123@bora0-bo89v.gcp.mongodb.net/test?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        requireDir("../models");
    }
};
