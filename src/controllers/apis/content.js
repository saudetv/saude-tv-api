const express = require('express');
const ContentServiceClass = require('../../services/contents');
const contentService = new ContentServiceClass;
const authMiddleware = require('../../middleware/auth');
let router = express.Router();

router.get('/', authMiddleware, contentService.index);
router.get('/:id', contentService.show);
router.post('/', authMiddleware, contentService.store);
router.put('/:id', contentService.update);
router.delete('/:id', contentService.destroy);
router.patch("/:id", contentService.update);

module.exports = router;
