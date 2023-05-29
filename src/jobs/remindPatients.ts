import { CronJob } from 'cron'
import config from 'config'
import { logger, StatusTypes, UserAttributes } from '../common'
import { mailClient } from '../mailClient'
import { Response } from '../resources/models/response'

const url = config.get<string>('baseUrl')

const remindPatients = async () => {
  logger.info('[Remind Patients Job] Starting....')

  let store = []
  let count = 0
  const oneHourAgo = new Date(new Date().getTime() - 60 * 60 * 1000)
  const pendingDueResponses = Response.find({
    due: { $gte: oneHourAgo, $lte: new Date() },
    status: StatusTypes.PENDING,
  })
    .populate({
      path: 'owner',
      select: ' firstName email -_id',
    })
    .cursor()

  for await (const response of pendingDueResponses) {
    const patient = response.owner as Pick<
      UserAttributes,
      'email' | 'firstName'
    >

    store.push(
      mailClient.sendMail({
        title: 'Notification',
        to: patient.email,
        subject: 'DocTool Reminder',
        greetingText: `Hi ${patient.firstName}, your doctor just wanted to remind you to respond to questions`,
        body: 'Tap the button below to view questions',
        buttonText: 'View',
        url: `${url}/api/questions/${response.question}`,
      }),
    )

    if (store.length === 10) {
      await Promise.allSettled(store)
      store = []
    }

    count++
  }

  if (store.length > 0) {
    await Promise.allSettled(store)
    store = []
  }

  logger.info(`[Remind Patients Job] Completed. ${count} records processed...`)
}

export const job = new CronJob('0 * * * *', remindPatients)
