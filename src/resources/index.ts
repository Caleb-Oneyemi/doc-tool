import { Router } from 'express'
import { CREATED, OK } from 'http-status'

import * as UserCtrl from './controllers/user'
import * as QuestionCtrl from './controllers/question'

import { auth, rateLimiter, wrapCtrl } from '../common'

const router = Router()

//USERS

router.post('/users', wrapCtrl(CREATED, UserCtrl.registerUser))

router.post('/users/login', rateLimiter, wrapCtrl(OK, UserCtrl.loginUser))

router.get('/users/verify/:token', wrapCtrl(OK, UserCtrl.verifyAccount))

// QUESTIONS

router.post(
  '/questions',
  auth(['ADMIN']),
  wrapCtrl(OK, QuestionCtrl.createQuestion),
)

router.patch(
  '/questions/:id',
  auth(['ADMIN']),
  wrapCtrl(OK, QuestionCtrl.updateQuestion),
)

router.post(
  '/questions/:id/send/:patientId',
  auth(['ADMIN']),
  wrapCtrl(OK, QuestionCtrl.sendQuestionToPatient),
)

router.get(
  '/questions/:id',
  auth(['ADMIN', 'PATIENT', 'STAFF']),
  wrapCtrl(OK, QuestionCtrl.getQuestionById),
)

export { router as ApiRouter }
