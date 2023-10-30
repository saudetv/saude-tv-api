const companyController = require("../../controllers/v2/company");
const userController = require("../../controllers/v2/user");
const playlistController = require("../../controllers/v2/playlist");
const contentViewLogs = require("../../controllers/apis/contentViewLogs");

const express = require("express");

let router = express.Router();

router.use("/companies", companyController);
router.use("/users", userController);
router.use("/content-view-logs", contentViewLogs);
router.use("/playlists", playlistController);

module.exports = router;
