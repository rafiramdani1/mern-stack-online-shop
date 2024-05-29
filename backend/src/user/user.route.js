import express from 'express'
import { userController } from './user.controller.js'
import { verifyTokenAccess } from '../../middleware/middleware.js'
import { addShippingAddressValidation, updateUserForCustomer, validationResults } from '../../validation/index.js'

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
userRouter.post('/add-shipping',
  verifyTokenAccess,
  addShippingAddressValidation,
  validationResults,
  userController.addShippingAddress
)

userRouter.put('/update-shopping',
  verifyTokenAccess,
  addShippingAddressValidation, validationResults,
  userController.updateShippingAddress
)

userRouter.put('/delete-shipping',
  verifyTokenAccess,
  userController.deleteShippingAddress
)
