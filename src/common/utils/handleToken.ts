import config from 'config'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { RequestUser } from '../types'

const secret = config.get<string>('jwtSecret')

export const generateToken = ({
  id,
  publicId,
  firstName,
  lastName,
  email,
  role,
}: RequestUser): string => {
  const user = {
    id,
    publicId,
    firstName,
    lastName,
    email,
    role,
  }

  return jwt.sign(user, secret, {
    expiresIn: '7d',
  })
}

export const validateToken = (token: string) => {
  return jwt.verify(token, secret) as RequestUser & JwtPayload
}
