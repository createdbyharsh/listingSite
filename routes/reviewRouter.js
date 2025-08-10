const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");

const {
  isLoggedIn,
  validateReview,
  reviewOwner,
  isOwner,
} = require("../middleware/isLoggedIn.js");

// Post review route
router.post(
  "/",
  isLoggedIn,
  // reviewOwner,
  validateReview,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id); // gets full listing data

    const newReview = new Review(req.body.review); // mongoose function to add data
    listing.reviews.push(newReview._id); // accessing listing data and adding review id
    await newReview.save();
    await listing.save();
    req.flash("success", "Review Created");
    res.redirect(`/listings/${id}`);
  })
);

// Delete review route
router.delete(
  "/:reviewid",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id, reviewid } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } }); // pulling is the update here
    await Review.findByIdAndDelete(reviewid);
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
