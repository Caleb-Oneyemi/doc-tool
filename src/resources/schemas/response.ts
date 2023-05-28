import { z } from 'zod'

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
