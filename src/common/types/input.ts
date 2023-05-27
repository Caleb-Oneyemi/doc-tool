import { UserAttributes } from './resources'

export type CreateUserInput = Omit<UserAttributes, 'publicId'>
