const JwtStrategy = require("./strategies/JwtStrategy");
const { GoogleStrategy, MicrosoftStrategy } = require("./strategies/OAuth2Strategies");
const User = require("./models/user.model");

module.exports = passport => {
  passport.use(JwtStrategy);
  passport.use(GoogleStrategy);
  passport.use(MicrosoftStrategy);

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
};
