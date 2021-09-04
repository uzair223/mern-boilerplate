const { STATUS_CODES } = require("http");

class HTTPError extends Error {
  constructor(code = 500, message, extra = {}) {
    super(message || STATUS_CODES[code]);
    this.extra = extra;
    this.status = code;
    this.name = (STATUS_CODES[code] + " Error").toPascalCase();
    Error.captureStackTrace(this, this.constructor);
  }
}

const BadRequest = (message, extra) => new HTTPError(400, message, extra);
const Unauthorized = (message, extra) => new HTTPError(401, message, extra);
const Forbidden = (message, extra) => new HTTPError(403, message, extra);
const NotFound = (message, extra) => new HTTPError(404, message, extra);

module.exports = {
  default: HTTPError,
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
};
