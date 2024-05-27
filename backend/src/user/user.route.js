import express from 'express'
import { userController } from './user.controller.js'
import { verifyTokenAccess } from '../../middleware/middleware.js'

export const userRouter = express.Router()

userRouter.get('/profile',
  verifyTokenAccess,
  userController.getProfileById
)
userRouter.post('/',
  verifyTokenAccess,
  userController.addUserDetail
)