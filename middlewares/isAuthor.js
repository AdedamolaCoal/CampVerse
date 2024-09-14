// Middleware to give edit permission to a campgrounds author
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
