const express = require("express");
const router = express.Router();
const User = require("../model/user.js");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { savedUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");

router
  .route("/signup")
  .get(userController.rendersignupForm)
  .post(wrapAsync(userController.signup));

router
  .route("/login")
  .get(userController.loginrenderForm)
  .post(
    savedUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

router.get("/logout", userController.logout);

module.exports = router;
