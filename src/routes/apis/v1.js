/********
* v1.js file (inside routes/apis)
********/

const userController = require('../../controllers/apis/user');
const travelController = require('../../controllers/apis/travel');
const questionController = require('../../controllers/apis/question');
const express = require('express');

let router = express.Router();
router.use('/users', userController);
router.use('/travels', travelController);
router.use('/questions', questionController);
module.exports = router;
