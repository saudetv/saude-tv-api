/********
* v1.js file (inside routes/apis)
********/

const userController = require('../../controllers/apis/user');
const travelController = require('../../controllers/apis/travel');
const express = require('express');
let router = express.Router();
router.use('/users', userController);
router.use('/travels', travelController);
module.exports = router;