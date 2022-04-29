const express = require('express');
const TerminalServiceClass = require('../../services/terminals');
const terminalService = new TerminalServiceClass;
const authMiddleware = require('../../middleware/auth');
let router = express.Router();

router.get('/', terminalService.index);
router.get('/:id', terminalService.show);
router.post('/', authMiddleware, terminalService.store);
router.put('/:id', terminalService.update);
router.delete('/:id', terminalService.destroy);
router.patch("/:id", terminalService.update);
router.post("/:id/copy", terminalService.copy);

module.exports = router;
