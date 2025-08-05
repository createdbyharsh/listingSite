const mongoose = require("mongoose");

//schema
const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: {
    filename: String,
    url: {
      type: String,
    },
  },
  price: Number,
  location: String,
  country: String,
});

//model
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
