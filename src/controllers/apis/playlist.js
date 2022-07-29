const express = require("express");
const PlaylistServiceClass = require("../../services/playlist");
const playlistService = new PlaylistServiceClass();
const authMiddleware = require("../../middleware/auth");
let router = express.Router();

router.get("/", playlistService.index);
router.get("/playlists-by-week", async (req, res) => {
  res.json(await playlistService.playlistsByWeek());
});
router.get("/:id", playlistService.show);
router.post("/", authMiddleware, playlistService.store);
router.put("/:id", playlistService.update);
router.delete("/:id", playlistService.destroy);
router.patch("/:id", playlistService.update);

module.exports = router;
