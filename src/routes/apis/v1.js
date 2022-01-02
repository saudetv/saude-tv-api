/********
* v1.js file (inside routes/apis)
********/

const userController = require('../../controllers/apis/user');
const porjectController = require('../../controllers/apis/project');
const express = require('express');

let router = express.Router();
router.use('/users', userController);
router.use('/projects', porjectController);

module.exports = router;
