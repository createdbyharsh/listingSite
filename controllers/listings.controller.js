const express = require("express");
const Listing = require("../models/listing.js");

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
  const newListing = new Listing(req.body.x); // mongoose function to add data
  newListing.owner = req.user._id; // inserting the userinfo into listings collections
  await newListing.save();
  req.flash("success", "New listing created");
  res.redirect("/listings");
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.x });
  req.flash("success", "listing updated");
  res.redirect("/listings");
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
  await Listing.findByIdAndDelete(id);
  req.flash("success", " listing Deleted");
  res.redirect("/listings");
};
