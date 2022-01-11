const express = require('express');
const PorjectServiceClass = require('../../services/advertise');
const projectService = new PorjectServiceClass;
const authMiddleware = require('../../middleware/auth');
let router = express.Router();

router.get('/', authMiddleware, projectService.index);
router.get('/:id', projectService.show);
router.post('/', authMiddleware, projectService.store);
router.put('/:id', projectService.update);
router.delete('/:id', projectService.destroy);
router.patch("/:id", projectService.update);

module.exports = router;
