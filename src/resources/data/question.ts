import { Question } from '../models/question'
import { QuestionAttributes } from '../models/types'

export const createQuestion = async (input: QuestionAttributes) => {
  return Question.addOne(input)
}

export const getQuestionById = async (id: string, populate?: boolean) => {
  if (!populate) {
    return Question.findById(id)
  }

  return Question.findOne(
    { _id: id },
    '-sendReminderAfter -updatedAt',
  ).populate({
    path: 'owner',
    select: 'firstName lastName email -_id',
  })
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
