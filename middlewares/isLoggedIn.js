const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports = isLoggedIn;

// const returnTo = (req, res, next) => {
//   if (res.locals.returnTo) {
//     res.locals.returnTo = req.session.returnTo;
//   }
//   next();
// }; // not used for now because it keeps returning to the login page as the last in memory. I'll come back to it if I don't find a better alternative later on.

// module.exports = returnTo;
