import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'

import { ApiRouter } from './resources'
import { errorHandler, NotFoundError } from './common'

const app = express()

app.use(cors())
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  }),
)

app.get('/', (req, res, next) => {
  res
    .status(200)
    .json({ data: { message: 'welcome to doc-tool' }, isSuccess: true })
})

app.use('/api', ApiRouter)

app.all('*', (req, res, next) => {
  next(new NotFoundError('route not found'))
})

app.use(errorHandler)

export { app }
