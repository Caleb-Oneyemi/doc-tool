import config from 'config'
import { SendgridClient } from './providers'

const { apiKey, sender } = config.get<{ apiKey: string; sender: string }>(
  'sendgrid',
)

export const mailClient = new SendgridClient(apiKey, sender)
