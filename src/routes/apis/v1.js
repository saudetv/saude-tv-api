/********
* v1.js file (inside routes/apis)
********/

const userController = require('../../controllers/apis/user');
const authController = require('../../controllers/apis/auth');
const express = require('express');
let router = express.Router();
router.use('/users', userController);
router.use('/auth', authController);
module.exports = router;