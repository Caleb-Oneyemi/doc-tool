import { User } from '../models/user'
import { UserAttributes, UserTypes } from '../../common'

export const createUser = async (input: UserAttributes) => {
  return User.addOne(input)
}

export const getUserByIdAndRole = async (
  id: string,
  role: keyof typeof UserTypes,
) => {
  return User.findOne({ _id: id, role })
}

export const getUserByEmail = async (email: string) => {
  return User.findOne({ email })
}

export const updateUser = async (
  id: string,
  input: Partial<UserAttributes>,
) => {
  return User.findOneAndUpdate(
    { _id: id },
    { $set: input },
    { new: true },
  ).exec()
}
