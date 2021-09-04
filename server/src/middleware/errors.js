const HTTPError = require("httperror").default;

const errorHandler = (err, req, res, next) => {
  let { message, status, extra } = err;
  if (!(err instanceof HTTPError)) {
    Logger.error(err.stack);
    if (process.env.NODE_ENV === "production") message = "Internal server error";
  }
  return res.status(status || 500).json({ message: message, ...extra });
};
const errorRedirect = redirect => (err, req, res, next) => {
  let { message, status, extra } = err;
  if (!(err instanceof HTTPError)) {
    Logger.error(err.stack);
    if (process.env.NODE_ENV === "production") message = "Internal server error";
  }
  const encodedErr = toQueryString({
    error: { status, message: message, ...extra },
  });
  return res.status(err.status || 500).redirect(`${redirect}?${encodedErr}`);
};

module.exports = errorHandler;
module.exports.errorRedirect = errorRedirect;
