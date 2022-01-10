/********
* v1.js file (inside routes/apis)
********/

const userController = require('../../controllers/apis/user');
const terminalController = require('../../controllers/apis/terminal');
const contentController = require('../../controllers/apis/content');
const rssController = require('../../controllers/apis/rss');
const express = require('express');

let router = express.Router();
router.use('/users', userController);
router.use('/terminals', terminalController);
router.use('/contents', contentController);
router.use('/rss', rssController);

module.exports = router;
