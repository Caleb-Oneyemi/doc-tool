import { Request, Response, NextFunction } from 'express'
import { TokenExpiredError } from 'jsonwebtoken'

import { UserTypes } from '../constants'
import { validateToken } from '../utils'
import { AuthenticationError, AuthorizationError } from '../errors'
import { RequestUser } from '../types'

export const auth = (allowedRole: Array<keyof typeof UserTypes>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const token = req.headers.authorization?.split('Bearer ')[1]
    if (!token) {
      return next(new AuthenticationError('not authenticated'))
    }

    let user: RequestUser
    try {
      user = validateToken(token)

      if (!allowedRole.includes(user.role)) {
        return next(new AuthorizationError('permission denied'))
      }
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        return next(new AuthenticationError('token expired'))
      }

      return next(new AuthenticationError('invalid token'))
    }

    req.user = {
      id: user.id,
      publicId: user.publicId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    }

    next()
  }
}
