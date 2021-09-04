const express = require("express");
const app = express();

const passport = require("passport");

const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const morgan = require("morgan");
const { stream } = require("./utils/Logger");
const cookieParser = require("cookie-parser");
const compression = require("compression");

const errorHandler = require("./middleware/errors");

const authRouter = require("@auth/auth.routes");
const userRouter = require("~/api.user/user.routes");

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(xss());
app.use(morgan(":method :url :status - :response-time ms", { stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(compression());

app.use(({ res, next }) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
});

app.use(passport.initialize());
require("@auth/passport")(passport);

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use(errorHandler);

module.exports = app;
