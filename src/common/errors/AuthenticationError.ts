import { CustomError } from './CustomError'
import { ErrorResult } from '../types'

export class AuthenticationError extends CustomError {
  statusCode = 401

  constructor(public message: string) {
    super(message)

    Object.setPrototypeOf(this, AuthenticationError.prototype)
  }

  serializeErrors(): Array<ErrorResult> {
    return [{ message: this.message }]
  }
}
