import { Schema, model } from 'mongoose'
import { StatusTypes } from '../../common'

import {
  ResponseAttributes,
  ResponseDoc,
  ResponseModel,
  ResponseFields,
  CreateResponseInput,
} from './types'

const fieldSchema = new Schema<ResponseFields>(
  {
    text: {
      type: String,
      required: true,
      lowercase: true,
    },
    options: {
      type: [String],
    },
  },
  {
    _id: false,
  },
)

const responseSchema = new Schema<ResponseAttributes>(
  {
    question: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      required: true,
      default: StatusTypes.PENDING,
      enum: [...Object.keys(StatusTypes)],
    },
    due: {
      type: Date,
      required: true,
    },
    fields: {
      type: [fieldSchema],
    },
    links: {
      type: [String],
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

responseSchema.index({ question: 1, owner: 1 }, { unique: true })

responseSchema.statics.addOne = (input: CreateResponseInput) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return new Response(input).save()
}

export const Response = model<ResponseDoc, ResponseModel>(
  'Response',
  responseSchema,
)
