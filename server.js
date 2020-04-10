const express = require("express");
const cors = require("cors");

const db = require("./src/config/db");

db.connect();

const routes = require("./src/routes");

// process.env.NODE_ENV = 'production';

// require('dotenv').config({
//   path: process.env.NODE_ENV === "test" ? ".env.testing" : ".env.production"
// })

const app = express();
app.use(express.json());
app.use(cors());

routes.register(app);

app.listen(process.env.PORT);

module.exports = app;
