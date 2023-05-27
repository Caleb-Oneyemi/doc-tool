import { UserAttributes } from './resources'

export type RequestUser = Omit<UserAttributes, 'password'>
