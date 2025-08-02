const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const app = express();
const port = 3000;
const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

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

app.listen(port, () => {
  console.log("App is running at port 3000");
});
