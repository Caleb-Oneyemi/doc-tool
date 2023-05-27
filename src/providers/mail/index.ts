import fs from 'fs'
import sgMail from '@sendgrid/mail'
import mustache from 'mustache'

import { MailInput, logger } from '../../common'

const backupTemplate = `
  <html>
    <head>
      <title>{{title}}</title>
    </head>
    <body>
      <h1>{{greetingText}},</h1>
      <p>{{body}}</p>
      <button><a href={{url}}>{{buttonText}}</a></button>
    </body>
  </html>
`

let mainTemplate: string

try {
  mainTemplate = fs
    .readFileSync('src/providers/mail/templates/main.html')
    .toString()
} catch (err) {
  logger.warn(`Error reading main email html template --- ${err}`)
}

export class SendgridClient {
  private mailClient
  private sender

  constructor(apiKey: string, sender: string) {
    this.sender = sender
    this.mailClient = sgMail
    this.mailClient.setApiKey(apiKey)
  }

  private renderTemplate(input: Omit<MailInput, 'to' | 'subject'>) {
    const template = mainTemplate || backupTemplate
    const html = mustache.render(template, input)
    return html
  }

  async sendMail({
    to,
    subject,
    title,
    greetingText,
    body,
    buttonText,
    url,
  }: MailInput) {
    const html = this.renderTemplate({
      title,
      greetingText,
      body,
      buttonText,
      url,
    })

    return this.mailClient.send({
      from: this.sender,
      to,
      subject,
      html,
    })
  }
}
