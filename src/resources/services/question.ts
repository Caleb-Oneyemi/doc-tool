import * as DAL from '../data/question'
import { QuestionAttributes, QuestionField } from '../models/types'

export const createQuestion = async (
  input: Omit<QuestionAttributes, 'fields'> & {
    fields: Array<Omit<QuestionField, 'options'> & { options?: string[] }>
  },
) => {
  const indexMap: { [key: number]: 'A' | 'B' | 'C' | 'D' | 'E' } = {
    0: 'A',
    1: 'B',
    2: 'C',
    3: 'D',
    4: 'E',
  }

  const fields = input.fields.map((field) => {
    if (field?.options) {
      field.options = field.options.map((option, i) => {
        const index = indexMap[i]
        return { [index]: option }
      }) as any

      return field
    }

    return field
  }) as Array<QuestionField>

  return DAL.createQuestion({ ...input, fields })
}
