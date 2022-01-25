const express = require("express");
const cors = require("cors");

const passport = require("passport")

const db = require("./src/config/db");

var envPath = '.env';

switch (process.env.NODE_ENV) {
  case "test":
    envPath = '.env.testing'
    break;
  case "production":
    envPath = '.env.production'
    break;
  case "staging":
    envPath = '.env.staging'
    break;

  default:
    envPath = '.env'
    break;
}

require('dotenv').config({
  path: envPath
})

db.connect();

const routes = require("./src/routes");

const app = express();
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb'}));
app.use(cors());


app.use(passport.initialize());
app.use(passport.session());

routes.register(app);

app.listen(process.env.PORT || process.env.APP_PORT);

module.exports = app;
