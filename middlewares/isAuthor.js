// Middleware to validate the author of the campground for edit
const Campground = require("../models/campground");

const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have authorization to perform this action!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports = isAuthor;
