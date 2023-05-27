import { AuthorizationError, NotFoundError } from '../../common'
import * as DAL from '../data/question'
import { QuestionAttributes, QuestionField } from '../models/types'

type FieldInput = Array<Omit<QuestionField, 'options'> & { options?: string[] }>

type QuestionInput = Omit<QuestionAttributes, 'fields'> & {
  fields: FieldInput
}

const formatFields = (arr: FieldInput) => {
  const indexMap: { [key: number]: 'A' | 'B' | 'C' | 'D' | 'E' } = {
    0: 'A',
    1: 'B',
    2: 'C',
    3: 'D',
    4: 'E',
  }

  return arr.map((field) => {
    if (field?.options) {
      field.options = field.options.map((option, i) => {
        const index = indexMap[i]
        return { [index]: option }
      }) as any

      return field
    }

    return field
  }) as Array<QuestionField>
}

export const createQuestion = async (input: QuestionInput) => {
  const fields = formatFields(input.fields)
  return DAL.createQuestion({ ...input, fields })
}

export const updateQuestion = async (
  id: string,
  userId: string,
  input: Partial<QuestionInput>,
) => {
  const question = await DAL.getQuestionById(id)
  if (!question) {
    throw new NotFoundError('question record does not exist')
  }

  if (question.owner.toString() !== userId) {
    throw new AuthorizationError('permission denied')
  }

  if (input.fields) {
    input.fields = formatFields(input?.fields || []) as any
  }

  return DAL.updateQuestion(id, input as QuestionAttributes)
}
