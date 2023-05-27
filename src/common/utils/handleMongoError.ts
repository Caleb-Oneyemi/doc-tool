import httpStatus from 'http-status'
import mongoose from 'mongoose'
import { logger } from '../logger'
import { mongoErrors } from '../constants'
import { FormatMongoErrorInput } from '../types'

const { CastError, ValidationError } = mongoose.Error

export const formatMongoError = (err: FormatMongoErrorInput) => {
  try {
    if (err instanceof CastError) {
      const message = `invalid ${err.path}`
      return {
        status: httpStatus.BAD_REQUEST,
        errors: [{ message, field: err.path }],
      }
    }

    if (err instanceof ValidationError) {
      const [key] = Object.keys(err.errors)
      const message = `invalid ${err.errors[key].path}`
      return {
        status: httpStatus.BAD_REQUEST,
        errors: [{ message, field: err.errors[key].path }],
      }
    }

    if (err?.code === 11000) {
      const keys = Object.keys(err.keyValue!)
      return {
        status: httpStatus.CONFLICT,
        errors: [{ message: `${keys.join(' and ')} already in use` }],
      }
    }

    logger.error(err)
  } catch (err) {
    logger.error(err)
  }
}

export const isMongoError = (err: Error) => {
  return Object.keys(mongoErrors).includes(err.name)
}
