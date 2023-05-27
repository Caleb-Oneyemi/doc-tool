import { Response } from 'express'
import { ErrorResponse, SuccessResponse } from './response'

export interface CustomResponse extends Response {
  send: (data: SuccessResponse | ErrorResponse) => this
  json: (data: SuccessResponse | ErrorResponse) => this
}
