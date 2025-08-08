const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const { reviewSchema } = require("../schemaValidate.js");

// error handling function
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((z) => z.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Post review route
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id); // gets full listing data
    const newReview = new Review(req.body.review); // mongoose function to add data
    listing.reviews.push(newReview._id); // accessing listing data and adding review id
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${id}`);
  })
);

// Delete review route
router.delete(
  "/:reviewid",
  wrapAsync(async (req, res) => {
    let { id, reviewid } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } }); // pulling is the update here
    await Review.findByIdAndDelete(reviewid);
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
