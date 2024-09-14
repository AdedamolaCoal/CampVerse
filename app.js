// ENVIRONMENT VARIABLE FOR DEVELOPMENT MODE
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const engine = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./errorUtils/ExpressError.js");

// ROUTES
const campgroundRoutes = require("./routes/campgroundRoutes.js");
const reviewRoutes = require("./routes/reviewRoutes.js");
const userRoutes = require("./routes/usersRoutes.js");

// AUTH
const passport = require("passport");
const LocalStrategy = require("passport-local");

// AUTH SESSIONS Y CONNECT_MONGO
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

// ALERT
const flash = require("connect-flash");
const { rmSync } = require("fs");

// MODELS
const User = require("./models/user.js");

// PORT
const appPort = 8080;

// *************MONGOOSE START*****************
// mongo db connection
const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected...");
});
// *************MONGOOSE END*****************

// *************APP LISTEN*****************
const port = process.env.PORT || appPort;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
// *************APP LISTEN END*****************

// *************APP SETS/USES*****************
app.engine("ejs", engine);
app.set("view engine", "ejs");

// path.join allows the access of whats in the specified folder from anywhere within the code.
app.set("views", path.join(__dirname, "views"));

//path to serve static files from. E.g: clientSideValidation.js to serve what the name implies.
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());

// *************Helmet Validations for content srcs*****************
app.use(helmet());

// allowed script links
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/",
];

// allowed style links
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/",
];
const connectSrcUrls = ["https://api.maptiler.com/"];

const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dhv3cnr1o/",
        "https://images.unsplash.com/",
        "https://static.vecteezy.com/",
        "https://api.maptiler.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);
// *************Helmet Validations for content srcs END*****************

// *************APP SETS/USES END*************

// *************SESSIONS Y MONGO-SESSIONS Y PASSPORTS****************
const secret = process.env.CRYPTO_SECRET || "thisshouldbeabettersecret!";
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60, // time period in seconds
  crypto: {
    secret,
  },
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
  store,
  name: "intercom",
  secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    // 1000=milliseconds, 60=seconds, 60=minutes, 24=hours 7=days
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7, //
  },
};

app.use(mongoSanitize());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

// this will authenticate users.
passport.use(new LocalStrategy(User.authenticate()));

// how users are stored in a session to remain logged in.
passport.serializeUser(User.serializeUser());

// how users are un-stored from a session and are logged out.
passport.deserializeUser(User.deserializeUser());

// *************SESSIONS AND PASSPORTS END****************

// NOTIFICATION(FLASH PKG) MIDDLEWARE GLOBAL (LOCAL) VARIABLES

app.use((req, res, next) => {
  console.log(req.user);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// *************ROUTES****************

// HOME PAGE
app.get("/", (req, res) => {
  res.render("home");
});

// USER ROUTES
app.use("/", userRoutes);

// CAMPGROUND ROUTES
app.use("/campgrounds", campgroundRoutes);

// REVIEW ROUTES
app.use("/campgrounds/:id/reviews", reviewRoutes);

// WILDCARD ROUTE FOR NON-EXISTING ROUTES
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no, something went wrong!";
  res.status(statusCode).render("error", { err });
  console.log(err.name);
});
