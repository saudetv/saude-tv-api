const db = require("./src/config/db");

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

  const routes = require("./src/routes");

  const app = express();
  app.use(cors({
    origin: '*', // Permita todas as origens ou altere para a URL do seu front-end
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // ou apenas os métodos HTTP que você usa
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true // permitir configuração de cookies de sites cross-site
  }));

  app.use(express.json({ limit: "700mb" }));
  app.use(express.urlencoded({ extended: true, limit: "700mb" }));


  app.use(passport.initialize());
  app.use(passport.session());

  routes.register(app);

  app.listen(process.env.PORT || process.env.APP_PORT);

  module.exports = app;
});
