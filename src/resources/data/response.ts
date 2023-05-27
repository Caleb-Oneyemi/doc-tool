import { Response } from '../models/response'
import { CreateResponseInput } from '../models/types'

export const createResponse = async (input: CreateResponseInput) => {
  return Response.addOne(input)
}
