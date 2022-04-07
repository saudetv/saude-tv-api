const express = require('express');
const InstagramServiceClass = require('../../services/instagram');
const instagramService = new InstagramServiceClass;
const authMiddleware = require('../../middleware/auth');
let router = express.Router();

router.get('/', authMiddleware, instagramService.index);
router.get('/:id', instagramService.show);
router.post('/', authMiddleware, instagramService.store);
router.put('/:id', instagramService.update);
router.delete('/:id', instagramService.destroy);
router.patch("/:id", instagramService.update);

module.exports = router;
