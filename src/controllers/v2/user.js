const express = require("express");
const UsersServiceClass = require("../../services/v2/users");
const userService = new UsersServiceClass();
const authMiddleware = require("../../middleware/auth");
let router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  res.json(await userService.index(req, res));
});

module.exports = router;
