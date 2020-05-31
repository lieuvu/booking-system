import * as winston from 'winston';
import { config } from '../config/system-config';

const formatLogLevel = winston.format((log) => {
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
})


const log = winston.createLogger({
  level: config.LOG.LEVEL,
  format: winston.format.combine(...formatArr),
  transports: [new winston.transports.Console()]
});

// Export
export { log };
