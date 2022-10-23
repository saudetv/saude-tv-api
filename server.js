require("newrelic")
const express = require("express");
const cors = require("cors");

const passport = require("passport");

const requireDir = require("require-dir");

const db = require("./src/config/db");

require("./src/jobs")

var envPath = ".env";

switch (process.env.NODE_ENV) {
  case "test":
    envPath = ".env.testing";
    break;
  case "production":
    envPath = ".env.production";
    break;
  case "staging":
    envPath = ".env.staging";
    break;

  default:
    envPath = ".env";
    break;
}

require("dotenv").config({
  path: envPath,
});

db.connect().then(() => {
  requireDir("./src/models");

  const routes = require("./src/routes");

  const app = express();
  app.use(express.json({ limit: "700mb" }));
  app.use(express.urlencoded({ extended: true, limit: "700mb" }));
  app.use(cors());

  app.use(passport.initialize());
  app.use(passport.session());

  routes.register(app);

  app.listen(process.env.PORT || process.env.APP_PORT);

  module.exports = app;
});
