import {
  registerUserSchema,
  RegisterUserSchemaType,
  loginSchema,
  LoginSchemaType,
} from '../schemas/user'

import * as UserService from '../services/user'
import { ControllerInput } from '../../common'

export const registerUser = async ({
  input,
}: ControllerInput<RegisterUserSchemaType>) => {
  await registerUserSchema.parseAsync(input)
  return UserService.createUser(input)
}

export const loginUser = async ({
  input,
}: ControllerInput<LoginSchemaType>) => {
  await loginSchema.parseAsync(input)
  return UserService.loginUser(input)
}
