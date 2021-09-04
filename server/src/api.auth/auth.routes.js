const router = require("express").Router();

const ash = require("ash");
const { authenticate } = require("~/middleware/authentication");

const errorRedirect = require("~/middleware/errors").errorRedirect;
const { NotFound, BadRequest, Forbidden, Unauthorized } = require("httperror");

const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");

const User = require("./models/user.model");
const { RefreshToken } = require("./models/token.model");

const { sendActivationEmail, sendSuccessEmail } = require("~/utils/nodemailer.js");

const generateJWT = (user, options = { expiresIn: "30m" }) =>
  jwt.sign({ sub: user._id }, process.env.JWT_SECRET, options);

// Check if user authenticated
router.use(authenticate("jwt", { strict: false }));

// ================== Registration ==================
// Main route
router.post(
  "/register",
  ash(async (req, res) => {
    const { email, username, password, name } = req.body; // Data will be validated at client.
    // Checking if user already exists
    let fields = {};
    const queryEmail = await User.findOne({ email });
    const queryUsername = await User.findOne({ username });
    if (queryEmail) fields.email = email;
    if (queryUsername) fields.username = username;
    if (Object.keys(fields).length !== 0) throw BadRequest("User already exists", { fields });
    const user = await User.create({
      email,
      username,
      password,
      name,
      activation: randomUUID(),
    });
    await sendActivationEmail(user);
    return res.json({ message: "Verification email has been sent" });
  }),
);

// Activation
router.get(
  "/register/verify/:token",
  ash(async (req, res) => {
    const token = req.params.token;
    const user = await User.findOne({ activation: token });
    if (!user)
      throw BadRequest("Activation token doesn't exist or has expired", {
        token,
      });
    user.activation = undefined;
    user.active = true;
    await user.save();
    await sendSuccessEmail(user);
    return res.json({ message: "User has been successfully activated" });
  }),
);

// ==================================================
const redirects = {
  failureRedirect: `${process.env.CLIENT_URL}/login`,
  successRedirect: `${process.env.CLIENT_URL}/`,
};

// ====================== Login =====================
router.post(
  "/login",
  ash(async (req, res) => {
    const { username, password } = req.body;
    const keepSession = req.body?.keepSession ?? true;
    const user = await User.findOne({ username });
    if (!user) throw NotFound("User doesn't exist", { fields: { username } });
    const correct = await user.passwordsMatch(password);
    if (!correct) throw Unauthorized("Incorrect password", { fields: { password: "hidden" } });
    if (!user.active) throw Forbidden("User hasn't been activated yet");

    const refresh_token = await RefreshToken.findOne({
      token: req.signedCookies["refresh_token"],
      user,
    });

    if (!refresh_token) {
      const token = randomUUID();
      await RefreshToken.create({ user, token });
      return res
        .cookie("refresh_token", token, {
          httpOnly: true,
          signed: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: keepSession && 1000 * 3600 * 24 * 14, // 2 weeks
        })
        .json({ access_token: generateJWT(user), user: user.filter() });
    }
    return res.json({ access_token: generateJWT(user), user: user.filter() });
  }),
);

// ===================== OAuth2 =====================
const authRedirect = ash(async (req, res) => {
  const redirect = `${redirects.successRedirect}?access_token=${encodeURIComponent(
    generateJWT(req.user),
  )}`;
  const refresh_token = await RefreshToken.findOne({
    token: req.signedCookies["refresh_token"],
    user: req.user,
  });
  if (!refresh_token) {
    token = randomUUID();
    await RefreshToken.create({ user: req.user, token });
    return res
      .cookie("refresh_token", token, {
        httpOnly: true,
        signed: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 3600 * 24 * 14, // 2 weeks
      })
      .redirect(redirect);
  }
  return res.redirect(redirect);
});

// Google OAuth2
router.get(
  "/google",
  authenticate("google", {
    options: {
      includeGrantedScopes: true,
      scope: [
        "profile",
        "email",
        "https://www.googleapis.com/auth/tasks",
        "https://www.googleapis.com/auth/calendar",
      ],
      accessType: "offline",
      approvalPrompt: "force",
    },
  }),
);

router.get(
  "/google/callback",
  authenticate("google"),
  authRedirect,
  errorRedirect(redirects.failureRedirect),
);
// Microsoft OAuth2
router.get(
  "/microsoft",
  authenticate("microsoft", {
    options: {
      scope: ["User.Read", "Tasks.ReadWrite", "Calendars.ReadWrite"],
      accessType: "offline",
      approvalPrompt: "force",
    },
  }),
);
router.get(
  "/microsoft/callback",
  authenticate("microsoft"),
  authRedirect,
  errorRedirect(redirects.failureRedirect),
);

// ===================== Tokens =====================
// Renew access token using refresh token cookie
router.get(
  "/token",
  ash(async (req, res) => {
    if (!req.signedCookies["refresh_token"]) throw Unauthorized("No refresh token");
    const refresh_token = await RefreshToken.findOne({
      token: req.signedCookies["refresh_token"],
    });
    if (!refresh_token) throw NotFound("Invalid refresh token");
    return res.json({
      message: "Access token issued",
      access_token: generateJWT(refresh_token.user),
    });
  }),
);

// Revoke refresh token cookie (logout)
router.get(
  "/token/revoke",
  ash(async (req, res) => {
    // Whether token exists or not is irrelevant
    await RefreshToken.deleteOne({ token: req.signedCookies["refresh_token"] });
    return res.clearCookie("refresh_token").json({ message: "Successfully logged out" });
  }),
);

module.exports = router;
