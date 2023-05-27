import { Request, NextFunction } from 'express'
import { ZodError } from 'zod'

import { BadRequestError } from '../errors'
import { ControllerFn, CustomResponse } from '../types'

export const wrapCtrl = (status: number, fn: ControllerFn) => {
  return async (req: Request, res: CustomResponse, next: NextFunction) => {
    try {
      const { body, params, query, user } = req

      const data = await fn({
        input: body,
        params,
        query,
        user,
      })

      res.status(status).send({
        isSuccess: true,
        data: data ? data : null,
      })
    } catch (err) {
      if (err instanceof ZodError) {
        return next(new BadRequestError(err))
      }

      next(err)
    }
  }
}
