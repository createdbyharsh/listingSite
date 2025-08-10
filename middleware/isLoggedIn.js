let isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "Login to proceed");
    return res.redirect("/login");
  }
  next();
};

module.exports = isLoggedIn;
