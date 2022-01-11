const express = require('express');
const PlaylistServiceClass = require('../../services/playlist');
const playlistService = new PlaylistServiceClass;
const authMiddleware = require('../../middleware/auth');
let router = express.Router();

router.get('/', authMiddleware, playlistService.index);
router.get('/:id', playlistService.show);
router.post('/', authMiddleware, playlistService.store);
router.put('/:id', playlistService.update);
router.delete('/:id', playlistService.destroy);
router.patch("/:id", playlistService.update);

module.exports = router;
