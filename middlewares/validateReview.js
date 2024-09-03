// Middleware to validate that the review data tallies with the schema
const ExpressError = require("../errorUtils/ExpressError.js");
const { reviewSchema } = require("../schemas.js");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    return new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports = validateReview;
