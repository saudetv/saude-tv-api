const auth = require("../middleware/auth");
const UserController = require("../controllers/UserController");

const simpleGit = require('simple-git')();
var versionGit = '0.0.1'

var swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('../config/swagger.json');

module.exports = {
  async register(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use("/v1/auth", UserController.login);
    // app.use(auth);
    app.use("/v1", require("./api"));
    app.get("/", ({ res }) => {
      res.json({
        appName: "Bora! API",
        currentVersionApi: versionGit
      });
    });
  }
};
