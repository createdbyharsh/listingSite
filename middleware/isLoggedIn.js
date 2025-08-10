module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // req.originalUrl is a data, saved in req object
    req.flash("error", "Login to proceed");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    console.log(req.session);
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
