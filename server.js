const express = require("express");
const cors = require("cors");

const passport = require("passport")

const db = require("./src/config/db");

require('dotenv').config({
  path: process.env.NODE_ENV === "test" ? ".env.testing" : ".env.production"
})

db.connect();

const routes = require("./src/routes");

const app = express();
app.use(express.json());
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

routes.register(app);

app.listen(process.env.PORT || process.env.APP_PORT);

module.exports = app;
