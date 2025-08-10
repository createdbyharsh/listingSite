let isLoggedIn = (req, res, next) => {
  console.log(req.user);
  if (!req.isAuthenticated()) {
    req.flash("error", "Login to proceed");
    return res.redirect("/login");
  }
  next();
};

module.exports = isLoggedIn;
