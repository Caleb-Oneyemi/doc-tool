import { RequestUser } from '../../user'

declare module 'express' {
  interface Request {
    user?: RequestUser
  }
}
