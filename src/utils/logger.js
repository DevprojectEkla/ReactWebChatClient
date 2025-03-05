import { apiBaseUrl } from '../config';

export const logLevel = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

const printLogLevel = {
    0: 'Debug',
    1: 'Info',
    2: 'Warn',
    3: 'error',
};

const getDebugVar = async () => {
    const debug = sessionStorage.getItem('DEBUG_LEVEL');

    return debug
        ? debug
        : await fetch(apiBaseUrl + '/api/debug')
              .then((res) => res.json())
              .then((data) => {
                  sessionStorage.setItem('DEBUG_LEVEL', data);
              });
};
const level = await getDebugVar();
const currentLogLevel = printLogLevel[parseInt(level)];

export const logger = {
    debug: (message, ...args) => log('debug', message, ...args),
    info: (message, ...args) => log('info', message, ...args),
    warn: (message, ...args) => log('warn', message, ...args),
    error: (message, ...args) => log('error', message, ...args),
};

export const log = (level, message, ...args) => {
    if (logLevel[level] >= currentLogLevel) {
        let formattedMessage = message;
        if (typeof message === 'object' && message !== null) {
            if (Array.isArray(message)) {
                formattedMessage = `[${message.join(', ')}]`;
            } else if (message.constructor === Object) {
                formattedMessage = JSON.stringify(message, null, 2);
            } else {
                formattedMessage = message.toString();
            }
        }
        switch (level) {
            case 'debug':
                console.warn(
                    `[${level.toUpperCase()}] ${formattedMessage}`,
                    ...args,
                );
                break;
            case 'info':
                console.info(
                    `[${level.toUpperCase()}] ${formattedMessage}`,
                    ...args,
                );
                break;
            case 'warn':
                console.warn(
                    `[${level.toUpperCase()}] ${formattedMessage}`,
                    ...args,
                );
                break;
            case 'error':
                console.error(
                    `[${level.toUpperCase()}] ${formattedMessage}`,
                    ...args,
                );
                break;
            default:
                console.warn(
                    `[${level.toUpperCase()}] ${formattedMessage}`,
                    ...args,
                );
        }
    }
};
logger.debug(currentLogLevel);
logger.debug(process.env.NODE_ENV);
logger.warn('DEBUG LEVEL:', currentLogLevel, printLogLevel[currentLogLevel]);
logger.info('DEBUG LEVEL:', currentLogLevel, printLogLevel[currentLogLevel]);
