const { Strategy, ExtractJwt } = require("passport-jwt");
const { NotFound, Forbidden } = require("httperror");
const ash = require("ash");

const User = require("../models/user.model");

module.exports = new Strategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  ash(async (payload, done) => {
    const user = await User.findById(payload.sub);
    if (!user) return done(NotFound("Invalid token"));
    if (Date.now() > Date(payload.exp)) return done(Forbidden("Token expired"));
    return done(null, user.filter());
  })
);
