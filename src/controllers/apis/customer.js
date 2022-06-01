const express = require("express");
const CustomerServiceClass = require("../../services/customer");
const customerService = new CustomerServiceClass();
const authMiddleware = require("../../middleware/auth");
let router = express.Router();

router.get("/", authMiddleware, customerService.index);
router.get("/:id", customerService.show);
router.post("/", authMiddleware, customerService.store);
router.put("/:id", customerService.update);
router.delete("/:id", customerService.destroy);
router.patch("/:id", customerService.update);
router.get("/cep/:cep", customerService.getAddressByCep);

module.exports = router;
