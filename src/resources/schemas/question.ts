import { z } from 'zod'
import { QuestionTypes } from '../../common'

const fieldSchema = z
  .object({
    text: z.string(),
    type: z.enum([
      QuestionTypes.FREE_TEXT,
      QuestionTypes.MULTIPLE_ANSWER,
      QuestionTypes.MULTIPLE_CHOICE,
    ]),
    options: z.array(z.string()).max(5).optional(),
  })
  .strict()

export const createQuestionSchema = z
  .object({
    title: z.string().trim().min(2).max(100),
    sendReminderAfter: z
      .number()
      .min(1)
      .refine((n) => Number.isInteger(n), 'must be an integer'),
    fields: z.array(fieldSchema),
  })
  .strict()

export type CreateQuestionSchemaType = z.infer<typeof createQuestionSchema>
