import { Question } from '../models/question'
import { QuestionAttributes } from '../models/types'

export const createQuestion = async (input: QuestionAttributes) => {
  return Question.addOne(input)
}
