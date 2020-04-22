const express = require('express');
const userService = require('../../services/users/user');
const authMiddleware = require('../../middleware/auth');
const passport = require("passport");
let router = express.Router();

router.get('/', authMiddleware, userService.index);
router.get('/:id', authMiddleware, userService.show);
router.post('/', userService.store);
router.put('/:id', authMiddleware, userService.update);
router.delete('/:id', authMiddleware, userService.destroy);
router.patch("/:id", authMiddleware, userService.update);
router.put("/:id/travels/:travelId", authMiddleware, userService.associateTravel);

module.exports = router;