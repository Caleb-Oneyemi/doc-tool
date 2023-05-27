import { Request, Response, NextFunction } from 'express'
import { RateLimitError } from '../errors'
import { rateLimiterRedis } from '../rateLimiterRedis'

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await rateLimiterRedis.consume(req.ip)
    next()
  } catch (err: any) {
    if (err instanceof Error) {
      return next(err)
    }

    const after = err?.msBeforeNext || 1000
    const retryAfter = String(Math.round(after / 1000))
    res.setHeader('Retry-After', retryAfter)
    next(new RateLimitError('request limit exceeded'))
  }
}
