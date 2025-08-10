const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schemaValidate.js");
const isLoggedIn = require("../middleware/isLoggedIn.js");

// error handling function
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((z) => z.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const result = await Listing.findById(id).populate("reviews");
    if (!result) {
      req.flash("error", "Your requested listing doesnt exist");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { result });
  })
);

router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.x); // mongoose function to add data
    await newListing.save();
    req.flash("success", "New listing created");
    res.redirect("/listings");
  })
);

router.put(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.x });
    req.flash("success", "listing updated");
    res.redirect("/listings");
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let result = await Listing.findById(id);
    if (!result) {
      req.flash("error", "Your requested listing doesnt exist");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { result });
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", " listing Deleted");
    res.redirect("/listings");
  })
);

module.exports = router;
