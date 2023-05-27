import config from 'config'
import { TokenExpiredError } from 'jsonwebtoken'
import * as DAL from '../data/user'
import { mailClient } from '../../mailClient'

import {
  AuthenticationError,
  BadRequestError,
  CreateUserInput,
  generatePublicId,
  generateToken,
  hashPassword,
  isPasswordValid,
  logger,
  UserAttributes,
  validateToken,
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
      url: `${url}/api/users/verify/${mailToken}`,
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

export const verifyAccount = async (token: string) => {
  let publicId

  try {
    const res = validateToken(token)
    publicId = res.publicId
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new BadRequestError('token expired')
    }

    throw new BadRequestError('invalid token')
  }

  const user = await DAL.updateUser(publicId, { isConfirmed: true })
  if (!user) {
    throw new Error(`failed to verify account for user with id ${publicId}`)
  }

  return { message: 'account verified successfully' }
}
