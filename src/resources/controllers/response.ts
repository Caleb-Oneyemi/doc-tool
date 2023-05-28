import {
  sendResponseSchema,
  SendResponseSchemaType,
  querySchema,
  QuerySchemaType,
} from '../schemas/response'

import * as ResponseService from '../services/response'
import { ControllerInput } from '../../common'

export const sendResponse = async ({
  input,
  params,
  user,
}: ControllerInput<SendResponseSchemaType, { id: string }>) => {
  await sendResponseSchema.parseAsync(input)
  return ResponseService.sendResponse(params.id, user?.id || '', input.fields)
}

export const getResponse = async ({
  params,
}: ControllerInput<{}, { id: string }>) => {
  return ResponseService.getResponse(params.id)
}

export const getResponses = async ({
  query,
}: ControllerInput<{}, {}, QuerySchemaType>) => {
  await querySchema.parseAsync(query)
  return ResponseService.getResponses(query)
}
