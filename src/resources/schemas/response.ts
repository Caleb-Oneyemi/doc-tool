import { z } from 'zod'
import { StatusTypes } from '../../common'

const fieldSchema = z.union([
  z
    .object({
      text: z.string().min(1),
    })
    .strict(),
  z
    .object({
      options: z.array(z.string()).min(1).max(5).optional(),
    })
    .strict(),
])

export const sendResponseSchema = z
  .object({
    fields: z.array(fieldSchema).min(1),
  })
  .strict()

export type SendResponseSchemaType = z.infer<typeof sendResponseSchema>

export const querySchema = z
  .object({
    page: z.coerce.number().positive(),
    limit: z.coerce.number().positive(),
    sort: z.enum(['asc', 'desc']),
    status: z.enum([StatusTypes.COMPLETED, StatusTypes.PENDING]),
    owner: z.string(),
  })
  .strict()
  .partial()

export type QuerySchemaType = z.infer<typeof querySchema>
