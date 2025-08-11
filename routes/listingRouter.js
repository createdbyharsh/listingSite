const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const {
  index,
  newListingForm,
  viewListing,
  createListing,
  updateListing,
  renderEditForm,
  deleteListing,
} = require("../controllers/listings.controller.js");

const {
  isLoggedIn,
  isOwner,
  validateListing,
} = require("../middleware/isLoggedIn.js");

router.get("/", wrapAsync(index));

router.get("/new", isLoggedIn, newListingForm);

router.get("/:id", wrapAsync(viewListing));

router.post("/", isLoggedIn, validateListing, wrapAsync(createListing));

router.put("/:id", isLoggedIn, isOwner, wrapAsync(updateListing));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEditForm));

router.delete("/:id", isLoggedIn, isOwner, wrapAsync(deleteListing));

module.exports = router;
