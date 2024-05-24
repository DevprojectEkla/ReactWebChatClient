import { isDevelopment } from "../config";

export const logLevel = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};
export const currentLogLevel = isDevelopment ? logLevel.debug : logLevel.info;

export const logger = {
  debug: (message) => log("debug", message),
  info: (message) => log("info", message),
  warn: (message) => log("warn", message),
  error: (message) => log("error", message),
};

export const log = (level, message, ...args) => {
  if (logLevel[level] >= currentLogLevel) {
    let formattedMessage = message;
    if (typeof message === "object" && message !== null) {
      if (Array.isArray(message)) {
        formattedMessage = `[${message.join(", ")}]`;
      } else if (message.constructor === Object) {
        formattedMessage = JSON.stringify(message, null, 2);
      } else {
        formattedMessage = message.toString();
      }
    }
    switch (level) {
      case "debug":
        console.debug(`[${level.toUpperCase()}] ${formattedMessage}`, ...args);
        break;
      case "info":
        console.info(`[${level.toUpperCase()}] ${formattedMessage}`, ...args);
        break;
      case "warn":
        console.warn(`[${level.toUpperCase()}] ${formattedMessage}`, ...args);
        break;
      case "error":
        console.error(`[${level.toUpperCase()}] ${formattedMessage}`, ...args);
        break;
      default:
        logger.debug(`[${level.toUpperCase()}] ${formattedMessage}`, ...args);
    }
  }
};
logger.debug(currentLogLevel);
logger.debug(process.env.NODE_ENV);
