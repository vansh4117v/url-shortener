import winston from "winston";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "warn";
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

export const logger = winston.createLogger({
  level: level(),
  levels,
  transports:
    process.env.NODE_ENV === "production"
      ? [
          new winston.transports.Console({
            format: consoleFormat,
          }),
        ]
      : [
          new winston.transports.Console({
            format: consoleFormat,
          }),
          new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
            format: fileFormat,
          }),
          new winston.transports.File({
            filename: "logs/all.log",
            format: fileFormat,
          }),
        ],
});

export const morganMiddleware = (tokens, req, res) => {
  return JSON.stringify({
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: Number.parseFloat(tokens.status(req, res)),
    content_length: tokens.res(req, res, "content-length"),
    response_time: Number.parseFloat(tokens["response-time"](req, res)),
  });
};
