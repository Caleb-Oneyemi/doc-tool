import { Document, Model } from 'mongoose'
import { UserAttributes, QuestionTypes } from '../../common'

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
