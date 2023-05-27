import { RateLimiterRedis } from 'rate-limiter-flexible'
import { client } from './redisClient'

const config = {
  allowedRequestsInWindow: 3,
  requestWindowInSeconds: 60,
  retryAfterInSeconds: 60 * 60,
}

const rateLimiterRedis = new RateLimiterRedis({
  storeClient: client,
  keyPrefix: 'LIMITER',
  points: config.allowedRequestsInWindow,
  duration: config.requestWindowInSeconds,
  blockDuration: config.retryAfterInSeconds,
})

export { rateLimiterRedis }
