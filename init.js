const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const allListing = [
  {
    title: "title test",
    description: "desc test",
    price: 1000,
    location: "bengaluru",
    country: "India",
  },
];

Listing.insertMany(allListing)
  .then(() => {
    console.log("init worked");
  })
  .catch((err) => {
    console.log(err);
  });
