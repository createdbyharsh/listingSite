const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {
  createReview,
  deleteReview,
} = require("../controllers/reviews.controller.js");

const {
  isLoggedIn,
  validateReview,
  reviewOwner,
  isOwner,
} = require("../middleware/isLoggedIn.js");

// Post review route
router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));

// Delete review route
router.delete("/:reviewid", isLoggedIn, reviewOwner, wrapAsync(deleteReview));

module.exports = router;
