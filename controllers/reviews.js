// MODELS
const Campground = require("../models/campground.js");
const Review = require("../models/review.js");

module.exports.create = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  campground.reviews.push(newReview);
  await newReview.save();
  await campground.save();
  req.flash("success", "Review Created Successfully.");
  res.redirect(`/campgrounds/${campground._id}`);
}; // Create route for Reviews

module.exports.delete = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted Successfully.");
  res.redirect(`/campgrounds/${id}`);
}; // Delete route for Reviews
