import Redis from 'ioredis'
import config from 'config'
import { logger } from './logger'

const url = config.get<string>('redisUrl')

export const client = new Redis(url, {
  lazyConnect: true,
})

client.on('error', (err) => {
  logger.error(err)
})
