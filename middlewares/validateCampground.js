// Middleware to validate new campgrounds data tallies with the schema
const ExpressError = require("../errorUtils/ExpressError.js");
const { campgroundSchema } = require("../schemas.js");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    return next(new ExpressError(msg, 400));
  } else {
    next();
  }
};

module.exports = validateCampground;
