const db = require("./src/config/db");

require("newrelic");

const requireDir = require("require-dir");

const express = require("express");

const cors = require("cors");

const passport = require("passport");

require("./src/jobs");

var envPath = ".env";

try {
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
} catch (error) {
  console.log("Error when determining environment:", error);
}

try {
  require("dotenv").config({
    path: envPath,
  });
} catch (error) {
  console.log("Error when configuring dotenv:", error);
}

const connectToDatabase = async () => {
  let connected = false;
  while (!connected) {
    try {
      await db.connect();
      connected = true;
      console.log(`Connected to database`);
    } catch (error) {
      console.log(
        `Could not connect to database. Retrying in 5 seconds...`,
        error
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

connectToDatabase()
  .then(() => {
    try {
      requireDir("./src/models");

      const app = express();
      app.use(express.json({ limit: "700mb" }));
      app.use(express.urlencoded({ extended: true, limit: "700mb" }));

      app.use(
        cors({
          origin: [
            "https://saude-tv-frontend.vercel.app",
            "http://localhost:8080",
            "http://saudetvpainel.com.br",
            "http://www.saudetvpainel.com.br",
          ],
          methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
          allowedHeaders: ["Content-Type", "Authorization"],
        })
      );

      const routes = require("./src/routes");

      app.use(passport.initialize());
      app.use(passport.session());

      routes.register(app);

      app.listen(process.env.PORT || process.env.APP_PORT);

      console.log(`Listening on port ${process.env.PORT}`);

      module.exports = app;
    } catch (error) {
      console.log("Error in express app setup:", error);
    }
  })
  .catch((error) => {
    console.log("Error in connecting to database:", error);
  });
