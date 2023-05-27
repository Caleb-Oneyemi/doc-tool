import { User } from '../models/user'
import { UserAttributes } from '../../common'

export const createUser = async (input: UserAttributes) => {
  return User.addOne(input)
}

export const getUserByPublicId = async (publicId: string) => {
  return User.findOne({ publicId })
}

export const getUserByEmail = async (email: string) => {
  return User.findOne({ email })
}
