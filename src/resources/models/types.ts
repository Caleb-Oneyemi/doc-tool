import { Document, Model } from 'mongoose'
import { UserAttributes, QuestionTypes, StatusTypes } from '../../common'

export interface FieldOption {
  A?: string
  B?: string
  C?: string
  D?: string
  E?: string
}

export interface QuestionField {
  text: string
  type: keyof typeof QuestionTypes
  options?: Array<FieldOption>
}

export interface QuestionAttributes {
  title: string
  owner: string | UserAttributes
  sendReminderAfter: number
  fields: Array<QuestionField>
}

export interface QuestionDoc extends QuestionAttributes, Document {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface QuestionModel extends Model<QuestionDoc> {
  addOne(input: QuestionAttributes): QuestionDoc
}

export type ResponseFields =
  | {
      text?: string
    }
  | { options?: string[] }

export interface ResponseAttributes {
  question: string | QuestionAttributes
  owner: string | UserAttributes
  status: keyof typeof StatusTypes
  due: Date
  fields: Array<ResponseFields>
  links?: string[]
}

export interface ResponseDoc extends ResponseAttributes, Document {
  id: string
  createdAt: Date
  updatedAt: Date
}

export type CreateResponseInput = Pick<
  ResponseAttributes,
  'question' | 'owner' | 'due'
>

export interface ResponseModel extends Model<ResponseDoc> {
  addOne(input: CreateResponseInput): ResponseDoc
}
