import express from 'express'
import { userController } from './user.controller.js'
import { verifyTokenAccess } from '../../middleware/middleware.js'
import { updateUserForCustomer, validationResults } from '../../validation/index.js'

export const userRouter = express.Router()

userRouter.get('/profile',
  verifyTokenAccess,
  userController.getProfileById
)
userRouter.post('/',
  verifyTokenAccess,
  updateUserForCustomer,
  validationResults,
  userController.addUserDetail
)