import * as DAL from '../data/user'
import {
  AuthenticationError,
  CreateUserInput,
  generatePublicId,
  generateToken,
  hashPassword,
  isPasswordValid,
  UserAttributes,
} from '../../common'

export const createUser = async (input: CreateUserInput) => {
  const [hash, publicId] = await Promise.all([
    hashPassword(input.password),
    generatePublicId(),
  ])

  const data = { ...input, password: hash, publicId }

  return DAL.createUser(data)
}

export const loginUser = async ({
  email,
  password,
}: Pick<UserAttributes, 'email' | 'password'>) => {
  const existingUser = await DAL.getUserByEmail(email)
  if (!existingUser) {
    throw new AuthenticationError('invalid credentials')
  }

  const isValid = await isPasswordValid(password, existingUser.password)
  if (!isValid) {
    throw new AuthenticationError('invalid credentials')
  }

  const token = generateToken({
    publicId: existingUser.publicId,
    firstName: existingUser.firstName,
    lastName: existingUser.lastName,
    email: existingUser.email,
    role: existingUser.role,
  })

  return { user: existingUser, token }
}
