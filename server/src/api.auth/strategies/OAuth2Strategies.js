const GoogleStrategy = require("passport-google-oauth2").Strategy;
const MicrosoftStrategy = require("passport-microsoft").Strategy;

const { Forbidden } = require("httperror");

const User = require("../models/user.model");
const { ProviderToken } = require("../models/token.model");

const callback = async (req, accessToken, refreshToken, tokenDetails, profile, done) => {
  let user = req.user;
  if (user) {
    // Linking provider service to existing user
    user = await User.findByIdAndUpdate(user._id, {
      [profile.provider + "Id"]: profile.id,
    });
    if (await ProviderToken.findOne({ user })) return done(null, user);
  } else {
    // User with provider service already exists
    user = await User.findOne({ [profile.provider + "Id"]: profile.id });
    if (user) return done(null, user);

    user =
      // Linking provider if email is already in use
      (await User.findOneAndUpdate(
        { email: profile.emails[0].value },
        { [profile.provider + "Id"]: profile.id },
      )) ||
      // Else creating new user
      (await User.create({
        [profile.provider + "Id"]: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        active: true,
      }));
  }
  await ProviderToken.create({
    user,
    provider: profile.provider,
    accessToken,
    refreshToken,
    expiresAt: Date(tokenDetails.iat + tokenDetails.expires_at),
  });
  return done(null, user);
};

module.exports = {
  GoogleStrategy: new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: "/auth/google/callback",
      passReqToCallback: true,
    },
    callback,
  ),
  MicrosoftStrategy: new MicrosoftStrategy(
    {
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_SECRET,
      callbackURL: "/auth/microsoft/callback",
      passReqToCallback: true,
    },
    callback,
  ),
};
