const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../errorUtils/catchAsync");
// const storeReturnTo = require("../middleware.js");

// CONTROLLERS FOR USERS
const users = require("../controllers/users");

router
  .route("/register")
  .get(users.registerForm)
  .post(catchAsync(users.createUser));

router
  .route("/login")
  .get(users.loginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.loginUser
  );
// success versions of the one above exist. E.g: successFlash: true, successRedirect: "/",

router.get("/logout", users.logoutUser);

module.exports = router;
