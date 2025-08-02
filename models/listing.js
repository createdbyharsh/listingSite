const mongoose = require("mongoose");

//schema
const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: {
    type: String,
    default:
      "https://unsplash.com/photos/rocks-by-body-of-water-during-daytime-v17IhTzLICs",
    set: (
      x // ternary operator to set default image , if user does not uplaod image
    ) =>
      x === ""
        ? "https://unsplash.com/photos/rocks-by-body-of-water-during-daytime-v17IhTzLICs"
        : x,
  },
  price: Number,
  location: String,
  country: String,
});

//model
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
