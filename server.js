const db = require("./src/config/db");

require('newrelic');

const requireDir = require("require-dir");

const express = require("express");

const cors = require("cors");

const passport = require("passport");

require("./src/jobs");

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

const connectToDatabase = async () => {
  let connected = false;
  while (!connected) {
    try {
      await db.connect();
      connected = true;
      console.log(`Connected to database`);
    } catch (error) {
      console.log(`Could not connect to database. Retrying in 5 seconds...`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

connectToDatabase().then(() => {
  requireDir("./src/models");

  const app = express();
  app.use(express.json({ limit: "700mb" }));
  app.use(express.urlencoded({ extended: true, limit: "700mb" }));

  

  const routes = require("./src/routes");


  app.use(passport.initialize());
  app.use(passport.session());

  routes.register(app);

  app.listen(process.env.PORT || process.env.APP_PORT);

  module.exports = app;
});
