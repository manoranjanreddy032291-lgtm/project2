const express = require("express");

const router = express.Router();

const passport = require("passport");

const wrapAsync = require("../utils/wrapAsync.js");

const userController = require("../controllers/user.js");

const { saveRedirectUrl } = require("../middleware.js");

// router
//   .route("/signup")
//   .get(userController.renderregisterform)
//   .post(wrapAsync(userController.postnewuser));

router
  .route("/register")      
  .get(userController.renderregisterform)
  .post(wrapAsync(userController.postnewuser));


router
  .route("/login")
  .get(userController.renderloginform)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/users/login",  // ← add /users/
      failureFlash: true,
    }),
    userController.postlogin
  );

router.get("/logout", userController.logout);

module.exports = router;