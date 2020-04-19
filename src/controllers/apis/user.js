const express = require('express');
const userService = require('../../services/users/user');
const passport = require("passport");
let router = express.Router();

router.get('/', userService.index);

router.get('/:id', userService.show);

router.post('/', userService.store);

router.put('/:id', userService.update);

router.delete('/:id', userService.destroy);

router.patch("/:id", userService.update);

module.exports = router;