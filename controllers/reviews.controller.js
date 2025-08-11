const express = require("express");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id); // gets full listing data
  let newReview = new Review(req.body.review); // mongoose function to add data
  newReview.author = req.user._id;
  listing.reviews.push(newReview._id); // accessing listing data and adding review id
  await newReview.save();
  await listing.save();
  req.flash("success", "Review Created");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewid } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } }); // pulling is the update here
  await Review.findByIdAndDelete(reviewid);
  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`);
};
