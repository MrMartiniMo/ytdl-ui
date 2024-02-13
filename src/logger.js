// For more information about this file see https://dove.feathersjs.com/guides/cli/logging.html
import { createLogger, format, transports, addColors } from 'winston'

// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
export const logger = createLogger({
  // To see more detailed errors, change this to 'debug'
  level: 'info',
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    // format.align(),
    format.printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`)
  ),
  transports: [new transports.Console()]
})
