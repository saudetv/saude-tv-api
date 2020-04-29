const express = require('express');
const authService = require('../../services/auth');
const passport = require("passport");
let router = express.Router();

router.get("/facebook", passport.authorize('facebook', { scope: ['email'] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook"),
  authService.sendUser  
);

router.get("/fail", (req, res) => {
  res.send("Failed attempt");
});

router.post("/", authService.login);

module.exports = router;