const express = require('express');
const RssServiceClass = require('../../services/rss');
const rssService = new RssServiceClass;
const authMiddleware = require('../../middleware/auth');
let router = express.Router();

router.get('/', authMiddleware, rssService.index);
router.get('/:id', rssService.show);
router.post('/', authMiddleware, rssService.store);
router.put('/:id', rssService.update);
router.delete('/:id', rssService.destroy);
router.patch("/:id", rssService.update);

module.exports = router;
