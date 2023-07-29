const v1ApiController = require("./apis/v1");
const v2ApiController = require("./apis/v2");
const authController = require("../controllers/apis/auth");

var swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("../config/swagger.json");

module.exports = {
  async register(app) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use("/auth", authController);
    app.get("/v2", ({ res }) => {
      res.json({
        appName: "SAUDE TV! API - VERSION 2",
        currentVersionApi: "2.1",
      });
    });
    app.use("/v1", v1ApiController);
    app.use("/v2", v2ApiController);
    app.get("/", ({ res }) => {
      res.json({
        appName: "SAUDE TV! API",
        currentVersionApi: "2.0.5",
      });
    });
  },
};
