const Campground = require("../models/campground");
const Review = require("../models/review");

const isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have authorization to perform this action!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports = isReviewAuthor;
