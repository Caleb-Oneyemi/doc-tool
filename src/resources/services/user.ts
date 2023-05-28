import config from 'config'
import { TokenExpiredError } from 'jsonwebtoken'
import * as DAL from '../data/user'
import { mailClient } from '../../mailClient'

import {
  AuthenticationError,
  BadRequestError,
  CreateUserInput,
  generateToken,
  hashPassword,
  isPasswordValid,
  logger,
  UserAttributes,
  validateToken,
} from '../../common'

const url = config.get<string>('baseUrl')

export const createUser = async (input: CreateUserInput) => {
  const hash = await hashPassword(input.password)
  const result = await DAL.createUser({ ...input, password: hash })
  const mailToken = generateToken(result)

  mailClient
    .sendMail({
      title: 'Email Confirmation',
      to: input.email,
      subject: 'Verify Your Email',
      greetingText: `Hi ${input.firstName}, Welcome to Doc tool`,
      body: 'Tap the button below to verify your email address',
      buttonText: 'Verify',
      url: `${url}/api/users/verify/${mailToken}`,
    })
    .catch((err) => {
      logger.warn(
        `Error sending registration mail for user with id ${result.id} --- ${err}`,
      )
    })

  return result
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

  const token = generateToken(existingUser)

  return { user: existingUser, token }
}

export const verifyAccount = async (token: string) => {
  let id

  try {
    const res = validateToken(token)
    id = res.id
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new BadRequestError('token expired')
    }

    throw new BadRequestError('invalid token')
  }

  const user = await DAL.updateUser(id, { isConfirmed: true })
  if (!user) {
    throw new Error(`failed to verify account for user with id ${id}`)
  }

  return { message: 'account verified successfully' }
}
