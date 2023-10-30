const express = require("express");
const PlaylistServiceClass = require("../../services/v2/playlists");
const playlistService = new PlaylistServiceClass();
const authMiddleware = require("../../middleware/auth");
let router = express.Router();

router.post("/", authMiddleware, playlistService.store);

module.exports = router;
