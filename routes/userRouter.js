const express = require("express");
const router = express.Router();
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

router.route("/signup").get(GetSignUp).post(wrapAsync(signUp));

router
  .route("/login")
  .get(getLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    login // route
  );

router.get("/logout", logout);

module.exports = router;

// router.get("/signup", GetSignUp);

// router.post("/signup", wrapAsync(signUp));

// Login

// router.get("/login", getLoginForm);

// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   login
// );

// Log out
