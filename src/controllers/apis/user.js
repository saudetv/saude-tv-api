const express = require('express');
const userServiceClass = require('../../services/users');
const userService = new userServiceClass;
const authMiddleware = require('../../middleware/auth');
const passport = require("passport");
let router = express.Router();

router.get('/', authMiddleware, userService.index);
router.get('/:id', authMiddleware, userService.show);
router.post('/', userService.store);
router.put('/:id', authMiddleware, userService.update);
router.delete('/:id', authMiddleware, userService.destroy);
router.patch("/:id", authMiddleware, userService.update);
router.post("/:id/travels/:travelId", authMiddleware, userService.associateTravel);

module.exports = router;
