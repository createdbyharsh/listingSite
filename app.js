const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schemaValidate.js");

const app = express();
const port = 3000;
const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

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

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details
      .map((x) => {
        x.message;
      })
      .join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
  })
);

app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const result = await Listing.findById(id);
    res.render("listings/show.ejs", { result });
  })
);

app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    listingSchema.validate(req.body);
    const newListing = new Listing(req.body.x); // mongoose function to add data
    await newListing.save();
    res.redirect("/listings");
  })
);

app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.x });
    res.redirect("/listings");
  })
);
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let result = await Listing.findById(id);
    res.render("listings/edit.ejs", { result });
  })
);

app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(port, () => {
  console.log("App is running at port 3000");
});
