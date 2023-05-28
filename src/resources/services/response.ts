import config from 'config'
import * as DAL from '../data/response'
import * as UserDAL from '../data/user'
import { QuestionAttributes } from '../models/types'
import { mailClient } from '../../mailClient'
import { BadRequestError, NotFoundError, StatusTypes } from '../../common'

const url = config.get<string>('baseUrl')

interface SendResponseInput {
  text?: string
  options?: string[]
}

export const sendResponse = async (
  id: string,
  userId: string,
  fields: Array<SendResponseInput>,
) => {
  const pendingResponse = await DAL.getResponseByIdAndOwnerId(id, userId)
  if (!pendingResponse) {
    throw new NotFoundError('pending response record not found')
  }

  const indexMap: { [key: number]: 'A' | 'B' | 'C' | 'D' | 'E' } = {
    0: 'A',
    1: 'B',
    2: 'C',
    3: 'D',
    4: 'E',
  }

  const question = pendingResponse.question as QuestionAttributes
  const data = fields.map((responseField, idx) => {
    if (!question.fields[idx]) {
      throw new BadRequestError(
        `question only has ${idx} fields but you supplied more`,
      )
    }

    const questionText = question.fields[idx].text
    const questionType = question.fields[idx].type

    if (responseField?.text !== undefined && questionType !== 'FREE_TEXT') {
      throw new BadRequestError(
        `question "${questionText}" required a ${questionType} response but you supplied text`,
      )
    }

    if (responseField?.options !== undefined && questionType === 'FREE_TEXT') {
      throw new BadRequestError(
        `question "${questionText}" required a ${questionType} response but you supplied options`,
      )
    }

    if (
      responseField?.options &&
      responseField.options.length > 1 &&
      questionType === 'MULTIPLE_CHOICE'
    ) {
      throw new BadRequestError(
        `question "${questionText}" required one ${questionType} response but you supplied more than one option`,
      )
    }

    if (responseField.options) {
      const options = responseField.options.map((option) => {
        const len = (question.fields[idx].options || []).length
        if (option.toUpperCase() > indexMap[len - 1]) {
          throw new BadRequestError(
            `option ${option.toUpperCase()} not among options for question "${questionText}"`,
          )
        }

        return option.toUpperCase()
      })

      return { options }
    }

    return responseField
  })

  const admin = await UserDAL.getUserByIdAndRole(
    question.owner as string,
    'ADMIN',
  )
  if (admin?.email) {
    await mailClient.sendMail({
      title: 'Notification',
      to: admin.email,
      subject: 'DocTool Notification',
      greetingText: `Hi ${admin.firstName}, a patient has responded to your questions`,
      body: 'Tap the button below to view response',
      buttonText: 'View',
      url: `${url}/api/responses/${id}`,
    })
  }

  return DAL.updateResponse(id, { fields: data, status: StatusTypes.COMPLETED })
}

export const getResponse = async (id: string) => {
  const response = await DAL.getResponseById(id)
  if (!response) {
    throw new BadRequestError('response record does not exist')
  }

  const question = response.question
  //@ts-expect-error: allow
  response.question = undefined

  return { response, question }
}
