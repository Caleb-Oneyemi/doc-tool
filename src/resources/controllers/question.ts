import {
  createQuestionSchema,
  CreateQuestionSchemaType,
  updateQuestionSchema,
  UpdateQuestionSchemaType,
} from '../schemas/question'

import * as QuestionService from '../services/question'
import { ControllerInput } from '../../common'

export const createQuestion = async ({
  input,
  user,
}: ControllerInput<CreateQuestionSchemaType>) => {
  await createQuestionSchema.parseAsync(input)
  return QuestionService.createQuestion({
    ...input,
    owner: user?.id || '',
  })
}

export const updateQuestion = async ({
  input,
  params,
  user,
}: ControllerInput<UpdateQuestionSchemaType, { id: string }>) => {
  await updateQuestionSchema.parseAsync(input)
  return QuestionService.updateQuestion(params.id, user?.id || '', input)
}

export const sendQuestionToPatient = async ({
  params,
  user,
}: ControllerInput<{}, { id: string; patientId: string }>) => {
  return QuestionService.sendQuestionToPatient({
    questionId: params.id,
    patientId: params.patientId,
    userId: user?.id || '',
  })
}
