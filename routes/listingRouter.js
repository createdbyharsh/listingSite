const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

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

router.route("/").get(wrapAsync(index)).post(
  isLoggedIn,
  // validateListing,
  upload.single("x[image]"), // image saving middleware
  wrapAsync(createListing)
);

router.get("/new", isLoggedIn, newListingForm);

router
  .route("/:id")
  .get(wrapAsync(viewListing))
  .put(isLoggedIn, isOwner, wrapAsync(updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(deleteListing));

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEditForm));

module.exports = router;

// router.get("/", wrapAsync(index));

// router.get("/:id", wrapAsync(viewListing));

// router.post("/", isLoggedIn, validateListing, wrapAsync(createListing));

// router.put("/:id", isLoggedIn, isOwner, wrapAsync(updateListing));

// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(deleteListing));
