const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schemaValidate.js");
const { reviewSchema } = require("../schemaValidate.js");

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

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let result = await Listing.findById(id);
  if (!result.owner._id.equals(req.user._id)) {
    req.flash("error", "You are not authorized");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((z) => z.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((z) => z.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.reviewOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (listing.owner._id.equals(req.user._id)) {
    req.flash("error", "forbidden");
    return res.redirect(`/listings/${id}` || "/listings");
  }
  next();
};
