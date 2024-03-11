const express = require("express");
const ContentViewLogsServiceClass = require("../../services/contentViewLogs");
const contentViewLogsService = new ContentViewLogsServiceClass();
const authMiddleware = require("../../middleware/auth");
let router = express.Router();

router.get("/reports", contentViewLogsService.report);
router.get("/contents/:id", contentViewLogsService.getLogsByContentId);
router.get(
  "/totalViewsTerminals/:id",
  contentViewLogsService.getTotalViewsAndTerminals
);
router.get(
  "/viewsByDateRangeAndContentId/:id",
  contentViewLogsService.getViewsByInterval
);

router.get(
  "/viewsByRegion/:id",
  contentViewLogsService.getViewsByContentAndRegion
);

router.get(
  "/viewsByTerminalAndDay/:id",
  contentViewLogsService.getViewsByTerminalAndDay
);

module.exports = router;
