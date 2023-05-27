import { CustomError } from './CustomError'
import { ErrorResult } from '../types'

export class RateLimitError extends CustomError {
  statusCode = 429

  constructor(public message: string) {
    super(message)

    Object.setPrototypeOf(this, RateLimitError.prototype)
  }

  serializeErrors(): Array<ErrorResult> {
    return [{ message: this.message }]
  }
}
