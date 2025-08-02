const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");

const app = express();
const port = 3000;
const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("connected to Database");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/listings", async (req, res) => {
  const allListings = await Listing.find();
  res.render("listings/index.ejs", { allListings });
});

app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  const result = await Listing.findById(id);
  res.render("listings/show.ejs", { result });
});

app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.x); // mongoose function to
  await newListing.save();
  res.redirect("/listings");
});

app.get("/listings/edit/:id", async (req, res) => {
  let { id } = req.params;
  let result = await Listing.findById(id);
  res.render("listings/edit.ejs", { result });
});

app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.x });
  res.redirect("/listings");
});

app.delete("/listings/:id/delete", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});

app.listen(port, () => {
  console.log("App is running at port 3000");
});
