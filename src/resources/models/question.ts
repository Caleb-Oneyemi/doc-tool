import { Schema, model } from 'mongoose'
import { QuestionTypes } from '../../common'

import {
  FieldOption,
  QuestionAttributes,
  QuestionDoc,
  QuestionField,
  QuestionModel,
} from './types'

const optionsSchema = new Schema<FieldOption>(
  {
    A: String,
    B: String,
    C: String,
    D: String,
    E: String,
  },
  {
    _id: false,
  },
)

const fieldSchema = new Schema<QuestionField>(
  {
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [...Object.keys(QuestionTypes)],
    },
    options: {
      type: [optionsSchema],
    },
  },
  {
    _id: false,
  },
)

const questionSchema = new Schema<QuestionAttributes>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    sendReminderAfter: {
      type: Number,
      required: true,
    },
    fields: {
      type: [fieldSchema],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
      },
    },
  },
)

questionSchema.index({ title: 1, owner: 1 }, { unique: true })

questionSchema.statics.addOne = (input: QuestionAttributes) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return new Question(input).save()
}

export const Question = model<QuestionDoc, QuestionModel>(
  'Question',
  questionSchema,
)
