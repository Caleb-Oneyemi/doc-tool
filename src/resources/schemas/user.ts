import { z } from 'zod'
import { UserTypes } from '../../common'

export const registerUserSchema = z
  .object({
    firstName: z.string().trim().min(2).max(50),
    lastName: z.string().trim().min(2).max(50),
    email: z.string().trim().email(),
    password: z.string().trim().min(8).max(50),
    role: z.enum([UserTypes.ADMIN, UserTypes.STAFF, UserTypes.PATIENT]),
  })
  .strict()

export type RegisterUserSchemaType = z.infer<typeof registerUserSchema>

export const loginSchema = z
  .object({
    email: z.string().trim().email(),
    password: z.string(),
  })
  .strict()

export type LoginSchemaType = z.infer<typeof loginSchema>
