import config from 'config'
import * as DAL from '../data/question'
import * as UserDAL from '../data/user'
import * as ResponseDAL from '../data/response'
import { mailClient } from '../../mailClient'
import { QuestionAttributes, QuestionField } from '../models/types'
import { AuthorizationError, NotFoundError, UserTypes } from '../../common'

type FieldInput = Array<Omit<QuestionField, 'options'> & { options?: string[] }>

type QuestionInput = Omit<QuestionAttributes, 'fields'> & {
  fields: FieldInput
}
const url = config.get<string>('baseUrl')

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

export const sendQuestionToPatient = async ({
  questionId,
  patientId,
  userId,
}: {
  questionId: string
  patientId: string
  userId: string
}) => {
  const question = await DAL.getQuestionById(questionId)
  if (!question) {
    throw new NotFoundError('question record does not exist')
  }

  if (question.owner.toString() !== userId) {
    throw new AuthorizationError('permission denied')
  }

  const patient = await UserDAL.getUserByIdAndRole(patientId, UserTypes.PATIENT)
  if (!patient) {
    throw new NotFoundError('patient record does not exist')
  }

  const hourDifference = question.sendReminderAfter * 60 * 60 * 1000
  const currentDate = new Date()
  const dueDate = new Date(currentDate.getTime() + hourDifference)

  await ResponseDAL.createResponse({
    owner: patient.id,
    question: question.id,
    due: dueDate,
  })

  await mailClient.sendMail({
    title: 'Notification',
    to: patient.email,
    subject: 'DocTool Notification',
    greetingText: `Hi ${patient.firstName}, your doctor has some questions for you`,
    body: 'Tap the button below to view questions',
    buttonText: 'View',
    url: `${url}/api/questions/${questionId}`,
  })

  return { message: 'question sent to patient' }
}

export const getQuestionById = async (id: string) => {
  const question = await DAL.getQuestionById(id, true)
  if (!question) {
    throw new NotFoundError('question record does not exist')
  }
  return question
}
