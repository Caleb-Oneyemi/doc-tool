import { Schema, model } from 'mongoose'
import { UserAttributes, UserDoc, UserModel, UserTypes } from '../../common'

const userSchema = new Schema<UserAttributes>(
  {
    publicId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: [...Object.keys(UserTypes)],
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        delete ret.password
      },
    },
    toObject: {
      transform(_doc, ret) {
        delete ret.password
      },
    },
  },
)

userSchema.statics.addOne = (input: UserAttributes) => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return new User(input).save()
}

export const User = model<UserDoc, UserModel>('User', userSchema)
