const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listingRouter.js");
const reviewsRouter = require("./routes/reviewRouter.js");
const userRouter = require("./routes/userRouter.js");

const app = express();
const port = 3000;
const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  // setting expiry date
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // milliseconds
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // to avaid cross-scripting attacks
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

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

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/review", reviewsRouter);
app.use("/", userRouter);

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 501, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(port, () => {
  console.log("App is running at port 3000");
});
