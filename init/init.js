const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

async function main() {
  await mongoose.connect(MONGO_URL);
  await Listing.deleteMany({});
  initData.dataName = initData.dataName.map((x) => ({
    ...x,
    owner: "689856601e02edc5cdf36196",
  }));
  await Listing.insertMany(initData.dataName);
}

main()
  .then(() => {
    console.log("connected to DB");
    console.log("sample data added");
  })
  .catch((err) => {
    console.log(err);
  });
