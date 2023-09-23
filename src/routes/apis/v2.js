const companyController = require("../../controllers/v2/company");
const userController = require("../../controllers/v2/user");
const contentViewLogs = require("../../controllers/apis/contentViewLogs");

const express = require("express");

let router = express.Router();

router.use("/companies", companyController);
router.use("/users", userController);
router.use("/content-view-logs", contentViewLogs);

module.exports = router;
