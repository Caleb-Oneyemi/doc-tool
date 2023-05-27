import {
  createQuestionSchema,
  CreateQuestionSchemaType,
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
