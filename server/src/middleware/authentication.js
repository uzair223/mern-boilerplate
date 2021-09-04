const passport = require("passport");
const { Unauthorized } = require("httperror");

const authenticate =
  (strategy = "jwt", { options = { session: false }, strict = true } = {}) =>
  (req, res, next) =>
    passport.authenticate(strategy, options, (err, user, info) => {
      if (err) return next(err);
      if (strict && info?.message) return next(Unauthorized(info.message));
      if (!user) return next(null, false);
      req.logIn(user, (err, user) => {
        if (err) return next(err);
        return next(null, user);
      });
    })(req, res, next);

module.exports = {
  authenticate,
};
