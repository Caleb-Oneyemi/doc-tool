import config from 'config'
import mongoose from 'mongoose'

import { app } from './app'
import { logger, client as redis } from './common'

import './startup'

const port = config.get<number>('port')

const server = app.listen(port, () => {
  logger.debug(`listening on port ${port}...`)
})

const exceptionHandler = (error: Error) => {
  logger.error(error)

  redis.disconnect()
  mongoose.disconnect()

  if (server) {
    server.close()
  }

  process.exit(1)
}

process.on('uncaughtException', exceptionHandler)
process.on('unhandledRejection', exceptionHandler)
