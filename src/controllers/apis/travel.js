const express = require('express');
const travelService = require('../../services/travels');
const passport = require("passport");
let router = express.Router();

router.get('/', travelService.index);

router.get('/:id', travelService.show);

router.post('/', travelService.store);

router.put('/:id', travelService.update);

router.delete('/:id', travelService.destroy);

router.patch("/:id", travelService.update);

module.exports = router;