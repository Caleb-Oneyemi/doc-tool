import { Router } from 'express'
import { CREATED, OK } from 'http-status'

import * as UserCtrl from './controllers/user'
import * as QuestionCtrl from './controllers/question'

import { auth, rateLimiter, wrapCtrl } from '../common'

const router = Router()

router.post('/users', wrapCtrl(CREATED, UserCtrl.registerUser))

router.post('/users/login', rateLimiter, wrapCtrl(OK, UserCtrl.loginUser))

router.get('/users/verify/:token', wrapCtrl(OK, UserCtrl.verifyAccount))

router.post(
  '/questions',
  auth(['ADMIN']),
  wrapCtrl(OK, QuestionCtrl.createQuestion),
)

export { router as ApiRouter }
