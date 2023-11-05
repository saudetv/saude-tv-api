const express = require("express");
const ContentsService = require("../../services/v2/contents");
const contentsService = new ContentsService();
const authMiddleware = require("../../middleware/auth");
let router = express.Router();

router.post("/", authMiddleware, contentsService.store);

module.exports = router;
