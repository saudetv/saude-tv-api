/********
* v1.js file (inside routes/apis)
********/

const userController = require('../../controllers/apis/user');
const terminalController = require('../../controllers/apis/terminal');
const contentController = require('../../controllers/apis/content');
const express = require('express');

let router = express.Router();
router.use('/users', userController);
router.use('/terminals', terminalController);
router.use('/contents', contentController);

module.exports = router;
