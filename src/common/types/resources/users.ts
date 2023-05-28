import { Document, Model } from 'mongoose'
import { UserTypes } from '../../constants'

export interface UserAttributes {
  firstName: string
  lastName: string
  email: string
  password: string
  isConfirmed?: boolean
  role: keyof typeof UserTypes
}

export interface UserDoc extends UserAttributes, Document {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface UserModel extends Model<UserDoc> {
  addOne(input: UserAttributes): UserDoc
}
