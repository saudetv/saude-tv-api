const companyController = require("../../controllers/v2/company");
const express = require("express");

let router = express.Router();

router.use("/companies", companyController);

module.exports = router;
