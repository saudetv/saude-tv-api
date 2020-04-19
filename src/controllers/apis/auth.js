const express = require('express');
const passport = require("passport");
let router = express.Router();

router.get("/facebook", passport.authorize('facebook', { scope : ['email'] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/fail"
  })
);

router.get("/fail", (req, res) => {
  res.send("Failed attempt");
});

router.get("/", (req, res) => {
  res.send("Success");
});

// router.get("/auth", UserController.login);

module.exports = router;