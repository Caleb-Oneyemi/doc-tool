import httpStatus from 'http-status'
import { Request, NextFunction } from 'express'

import { CustomResponse } from '../types'
import { CustomError } from '../errors'
import { logger } from '../logger'
import { formatMongoError, isMongoError } from '../utils'

const defaultError = {
  status: httpStatus.INTERNAL_SERVER_ERROR,
  errors: [{ message: 'something went wrong' }],
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: CustomResponse,
  next: NextFunction,
): CustomResponse => {
  if (err instanceof CustomError) {
    return res
      .status(err.statusCode)
      .send({ errors: err.serializeErrors(), isSuccess: false })
  }

  if (isMongoError(err)) {
    const result = formatMongoError(err)
    return res
      .status(result?.status || defaultError.status)
      .send({ errors: result?.errors || defaultError.errors, isSuccess: false })
  }

  logger.error(err)

  return res.status(defaultError.status).send({
    errors: defaultError.errors,
    isSuccess: false,
  })
}
