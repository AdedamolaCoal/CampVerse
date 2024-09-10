// EXPRESS
const express = require("express");

// ROUTER
const router = express.Router();

// MODELS FOR CAMPGROUNDS
const Campground = require("../models/campground");

// ERROR VALIDATION FOR CAMPGROUNDS
const catchAsync = require("../errorUtils/catchAsync.js");
const ExpressError = require("../errorUtils/ExpressError.js");

// MIDDLEWARE VALIDATIONS FOR AUTHENTICATION
const validateCampground = require("../middlewares/validateCampground.js");
const isLoggedIn = require("../middlewares/isLoggedIn");
const isAuthor = require("../middlewares/isAuthor");

// CONTROLLERS
const campgrounds = require("../controllers/campgrounds");

// FILE CONTROL/UPLOAD
const { storage } = require("../cloudinary/index");
const multer = require("multer");
const upload = multer({ storage });

router.get("/home", (req, res) => {
  res.render("home.ejs");
});

router.get("/new", isLoggedIn, campgrounds.newForm); // new campground page

router.get("/allcamps", catchAsync(campgrounds.index)); // campgrounds page

// GET CREATE ROUTE FOR NEW CAMPGROUND (new.ejs)
router.post(
  "/",
  isLoggedIn,
  upload.array("image"),
  validateCampground,
  catchAsync(campgrounds.create)
); // route to post the new data to the db

router
  .route("/:id")
  .get(catchAsync(campgrounds.show)) // Show page
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.delete)); // delete page

router
  .route("/:id/edit")
  .get(isLoggedIn, isAuthor, catchAsync(campgrounds.edit)) // edit page
  .patch(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.update)
  ); // update page

module.exports = router;
