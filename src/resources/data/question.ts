import { Question } from '../models/question'
import { QuestionAttributes } from '../models/types'

export const createQuestion = async (input: QuestionAttributes) => {
  return Question.addOne(input)
}

export const getQuestionById = async (id: string) => {
  return Question.findById(id)
}

export const updateQuestion = async (
  id: string,
  input: Partial<QuestionAttributes>,
) => {
  return Question.findOneAndUpdate(
    { _id: id },
    { $set: input },
    { new: true },
  ).exec()
}
