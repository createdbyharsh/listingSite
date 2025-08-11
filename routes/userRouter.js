const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware/isLoggedIn");
const {
  GetSignUp,
  signUp,
  getLoginForm,
  login,
  logout,
} = require("../controllers/user.controller");

//Register

router.get("/signup", GetSignUp);

router.post("/signup", wrapAsync(signUp));

// Login

router.get("/login", getLoginForm);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  login
);

// Log out

router.get("/logout", logout);

module.exports = router;
