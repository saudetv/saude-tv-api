const express = require("express");
const ContentViewLogsServiceClass = require("../../services/contentViewLogs");
const contentViewLogsService = new ContentViewLogsServiceClass();
const authMiddleware = require("../../middleware/auth");
let router = express.Router();

router.get("/reports", contentViewLogsService.report);

module.exports = router;
