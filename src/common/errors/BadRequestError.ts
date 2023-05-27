import { ZodError } from 'zod'
import { CustomError } from './CustomError'
import { ErrorResult } from '../types'

export class BadRequestError extends CustomError {
  statusCode = 400

  constructor(public input: string | ZodError) {
    super(typeof input === 'string' ? input : '')

    Object.setPrototypeOf(this, BadRequestError.prototype)
  }

  serializeErrors(): Array<ErrorResult> {
    if (typeof this.input === 'string') return [{ message: this.message }]

    return this.input?.issues?.map(({ message, path }) => {
      const field = (path[0] || '').toString()
      return {
        message,
        field,
      }
    })
  }
}
