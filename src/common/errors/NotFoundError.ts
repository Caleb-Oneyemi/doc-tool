import { CustomError } from './CustomError'
import { ErrorResult } from '../types'

export class NotFoundError extends CustomError {
  statusCode = 404

  constructor(public message: string) {
    super(message)

    Object.setPrototypeOf(this, NotFoundError.prototype)
  }

  serializeErrors(): Array<ErrorResult> {
    return [{ message: this.message }]
  }
}
