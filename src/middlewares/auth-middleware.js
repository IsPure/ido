const passport = require("passport");

exports.userAuth = (req, res, next) => {
  console.log("userAuth middleware called");
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(401).json({
        message: "Unauthorized",
        error: info ? info.message : "Invalid token",
      });
    }
    req.user = user;
    return next();
  })(req, res, next);
};
