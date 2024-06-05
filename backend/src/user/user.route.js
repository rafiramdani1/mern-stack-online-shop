import express from 'express'
import { userController } from './user.controller.js'
import { checkAuthAccessEditedUser, verifyTokenAccess } from '../../middleware/middleware.js'
import { addShippingAddressValidation, updateUserForCustomer, validationResults } from '../../validation/index.js'

export const userRouter = express.Router()

userRouter.get('/profile', verifyTokenAccess, userController.getProfileById)
userRouter.post('/', verifyTokenAccess, updateUserForCustomer, validationResults, userController.addUserDetail)
userRouter.get('/shipping-address', verifyTokenAccess, userController.getShippingAddressByUserId)
userRouter.post('/add-shipping', verifyTokenAccess, addShippingAddressValidation, validationResults, userController.addShippingAddress)
userRouter.put('/update-shopping', verifyTokenAccess, addShippingAddressValidation, validationResults, userController.updateShippingAddress)
userRouter.put('/delete-shipping', verifyTokenAccess, userController.deleteShippingAddress)
userRouter.put('/update-status-shipping', verifyTokenAccess, userController.updateStatusShippingToTrue)

userRouter.use(checkAuthAccessEditedUser)
userRouter.post('/upload-image-profile', verifyTokenAccess, userController.addImageProfile)
userRouter.put('/update-image-profile', verifyTokenAccess, userController.updateImageProfile)