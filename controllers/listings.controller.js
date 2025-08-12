const express = require("express");
const Listing = require("../models/listing.js");
const cloudinary = require("cloudinary").v2;

module.exports.index = async (req, res) => {
  const allListings = await Listing.find();
  res.render("listings/index.ejs", { allListings });
};

module.exports.newListingForm = async (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.viewListing = async (req, res) => {
  const { id } = req.params;
  const result = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!result) {
    req.flash("error", "Your requested listing doesnt exist");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { result });
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.x); // mongoose function to add data
  newListing.image = { url, filename }; // inserting the url and filename from cloudinary
  newListing.owner = req.user._id; // inserting the userinfo into listings collections
  await newListing.save();
  req.flash("success", "New listing created");
  res.redirect("/listings");
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  // Get the existing listing first so we can delete its old image if needed
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  // Update basic fields from form
  listing.set(req.body.x);
  // If a new file was uploaded
  if (req.file) {
    // Delete old image from Cloudinary if it exists
    if (listing.image && listing.image.filename) {
      await cloudinary.uploader.destroy(listing.image.filename);
    }
    // Save new image info
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }
  await listing.save();
  req.flash("success", "Listing updated");
  res.redirect(`/listings/${id}`);
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let result = await Listing.findById(id);
  if (!result) {
    req.flash("error", "Your requested listing doesnt exist");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { result });
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (listing.image && listing.image.filename) {
    await cloudinary.uploader.destroy(listing.image.filename);
  }
  await Listing.findByIdAndDelete(id);
  req.flash("success", " listing Deleted");
  res.redirect("/listings");
};
