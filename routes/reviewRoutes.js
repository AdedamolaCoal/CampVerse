// EXPRESS AND ROUTER
const express = require("express");
const router = express.Router({ mergeParams: true });
// ERROR VALIDATION FOR CAMPGROUNDS
const catchAsync = require("../errorUtils/catchAsync.js");
const validateReview = require("../middlewares/validateReview.js");
// MIDDLEWARE FOR AUTHENTICATION
const isLoggedIn = require("../middlewares/isLoggedIn");
const isReviewAuthor = require("../middlewares/isReviewAuthor");
// CONTROLLERS FOR REVIEWS
const reviews = require("../controllers/reviews");

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.create));

// REVIEW DELETE ROUTE
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.delete)
);

module.exports = router;
