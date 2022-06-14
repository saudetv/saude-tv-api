const v1ApiController = require("./apis/v1");
const authController = require("../controllers/apis/auth");
const getLatestTag = require('git-latest-tag');

const options = {
  all: 'ok',
  contains: true,
  candidates: 10,
  'commit-ish': 'HEAD'
};

var swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("../config/swagger.json");

module.exports = {
  async register(app) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use("/auth", authController);
    // app.use(auth);
    app.use("/v1", v1ApiController);
    app.get("/", ({ res }) => {
      res.json({
        appName: "SAUDE TV! API",
        currentVersionApi: versionGit,
      });
    });
  },
};
