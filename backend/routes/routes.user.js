import express from 'express'
import { getProfile, getUsers } from '../controllers/admin/user.controllers.js'
import { verifyTokenAccess, verifyTokenAccessAdmin } from '../middleware/middleware.js'

const routerUser = express.Router()

// End Point

// GET USERS
routerUser.get('/', verifyTokenAccessAdmin, getUsers)
routerUser.get('/profile', verifyTokenAccess, getProfile)

export default routerUser