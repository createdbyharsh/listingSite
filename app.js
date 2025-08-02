const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");

const app = express();
const port = 3000;
const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

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

app.listen(port, () => {
  console.log("App is running at port 3000");
});
