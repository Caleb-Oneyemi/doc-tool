import * as cronJobs from '../jobs'

Object.values(cronJobs).forEach((job) => job.start())
