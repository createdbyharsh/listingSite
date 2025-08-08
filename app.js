const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schemaValidate.js");
const Review = require("./models/review.js");
const { reviewSchema } = require("./schemaValidate.js");

const listings = require("./routes/listingRouter.js");
const reviews = require("./routes/reviewRouter.js");

const app = express();
const port = 3000;
const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));

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

app.use("/listings", listings);
app.use("/listings/:id/review", reviews);

app.get("/", (req, res) => {
  res.redirect("/listings");
});

// app.all(/.*/, (req, res, next) => {
//   next(new ExpressError(404, "Page not found"));
// });

// app.use((err, req, res, next) => {
//   let { statusCode = 501, message = "Something went wrong" } = err;
//   res.status(statusCode).render("error.ejs", { message });
// });

app.listen(port, () => {
  console.log("App is running at port 3000");
});
