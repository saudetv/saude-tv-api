const express = require("express");
const CompanyServiceClass = require("../../services/v2/company");
const companyService = new CompanyServiceClass();
const authMiddleware = require("../../middleware/auth");
let router = express.Router();

router.get("/my", authMiddleware, async (req, res) => {
  res.json(await companyService.my(req, res));
});
router.get("/my/contracts", authMiddleware, companyService.myContracts);
router.post("/my/contracts", authMiddleware, companyService.addContract);
router.get("/my/subscribers", authMiddleware, companyService.mySubscribers);
router.post("/:id/terminals", authMiddleware, companyService.addTerminal);

module.exports = router;
