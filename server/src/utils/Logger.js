const winston = require('winston');

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  HTTP: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  HTTP: 'blue',
  debug: 'grey',
};

const level = () => {
  const env = process.env.NODE_ENV || 'development'
  const isDevelopment = env === 'development'
  return isDevelopment ? 'debug' : 'warn'
};

winston.addColors(colors);

const logFormat = (msg) =>  winston.format.colorize().colorize(
  msg.level, `${msg.timestamp} >>> ${msg.message}`
);

Logger = winston.createLogger({
  level: level(),
  levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'DD-MM-YY HH:mm:ss' }),
    winston.format.printf(logFormat),
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

module.exports = Logger;
module.exports.stream = {
    write: (message) => Logger.HTTP(message)
}