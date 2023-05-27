import winston from 'winston'

const { createLogger, format, transports } = winston
const { combine, colorize, timestamp, printf } = format

export const logger = createLogger({
  level: 'debug',
  format: combine(
    colorize(),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    printf(({ timestamp, level, message, stack }) => {
      if (stack) {
        return `[doc-tool-api: ${timestamp} ${level}: ${stack}`
      }

      return `[doc-tool-api: ${timestamp}] ${level}: ${message}`
    }),
  ),
  transports: [new transports.Console()],
})
