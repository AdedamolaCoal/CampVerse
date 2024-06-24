const User = require("../models/user");

module.exports.registerForm = (req, res) => {
  res.render("users/register");
}; // Register route for Users

module.exports.createUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to YelpCamp!");
      res.redirect("/");
    });
  } catch (e) {
    if (e.code === 11000 && e.keyPattern && e.keyPattern.email) {
      req.flash("error", "Email already in use.");
    } else {
      req.flash("error", e.message);
    }
    res.redirect("/register");
  }
}; // Create route for Users

module.exports.loginForm = (req, res) => {
  res.render("users/login");
}; // Login route for Users

module.exports.loginUser = (req, res) => {
  req.flash("success", "Welcome Back!");
  res.redirect("/campgrounds/allcamps");
}; // Login auth for users

module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Goodbye!");
    res.redirect("/");
  });
}; // Logout route for Users
