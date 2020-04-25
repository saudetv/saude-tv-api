const express = require('express');
const travelServiceClass = require('../../services/travels');
const travelService = new travelServiceClass;
const authMiddleware = require('../../middleware/auth');

const baggageService = require('../../services/travels/baggage');
let router = express.Router();

router.get('/', authMiddleware, travelService.index);
router.get('/:id', travelService.show);
router.post('/', authMiddleware, travelService.store);
router.put('/:id', travelService.update);
router.delete('/:id', travelService.destroy);
router.patch("/:id", travelService.update);

router.post("/:id/baggages", baggageService.store);
router.get("/:id/baggages", baggageService.index);
router.get("/:id/baggages/:baggageId", baggageService.show);
router.put("/:id/baggages/:baggageId", baggageService.update);
router.patch("/:id/baggages/:baggageId", baggageService.changeStatus);
router.delete("/:id/baggages/:baggageId", baggageService.destroy);

router.post("/:id/routes", travelService.update);
router.put("/:id/routes/:id", travelService.update);

module.exports = router;