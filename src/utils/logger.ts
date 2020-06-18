// Library
import winston from 'winston';

// App
import { config } from '@src/config';

const formatLogLevel = winston.format(log => {
  log.level = log.level.toUpperCase();
  return log;
});

const colorizedFormatArr = [
  formatLogLevel(),
  winston.format.colorize({ all: true }),
  winston.format.simple(),
];

const nonColorizedFormatArr = [
  formatLogLevel(),
  winston.format.simple()
];

const formatArr = (config.LOG.COLOURIZED === 'true') ? colorizedFormatArr : nonColorizedFormatArr;

winston.addColors({
  error: 'bold red',
  warn: 'bold yellow',
  info: 'cyan',
  debug: 'green'
});

// Logger
const transportArr = (config.LOG.LOG_ENABLED === 'true' || config.LOG.LOG_ENABLED === true) ?
  [new winston.transports.Console()] :
  [new winston.transports.Console({ silent: true })];

const log = winston.createLogger({
  level: config.LOG.LEVEL,
  format: winston.format.combine(...formatArr),
  transports: transportArr
});

// Export
export default log;
