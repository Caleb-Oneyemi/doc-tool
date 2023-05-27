import config from 'config'
import * as DAL from '../data/user'
import { mailClient } from '../../mailClient'

import {
  AuthenticationError,
  CreateUserInput,
  generatePublicId,
  generateToken,
  hashPassword,
  isPasswordValid,
  logger,
  UserAttributes,
} from '../../common'

const url = config.get<string>('baseUrl')

export const createUser = async (input: CreateUserInput) => {
  const [hash, publicId] = await Promise.all([
    hashPassword(input.password),
    generatePublicId(),
  ])

  const result = await DAL.createUser({ ...input, password: hash, publicId })
  const mailToken = generateToken(result)

  mailClient
    .sendMail({
      title: 'Email Confirmation',
      to: input.email,
      subject: 'Verify Your Email',
      greetingText: `Hi ${input.firstName}, Welcome to Doc tool`,
      body: 'Tap the button below to verify your email address',
      buttonText: 'Verify',
      url: `${url}/verify/${mailToken}`,
    })
    .catch((err) => {
      logger.warn(
        `Error sending registration mail for user with publicId ${publicId} --- ${err}`,
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
