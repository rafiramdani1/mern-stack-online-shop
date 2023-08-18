import express from "express";
import { registerUser, loginUser, Logout } from "../controllers/auth.controllers.js";
import { validation, RegisterValidation, LoginValidation } from '../validation/index.js'
import { verifyEmail, verifyTokenAuthAdmin } from "../middleware/middleware.js";
import { refreshToken } from "../controllers/refreshToken.js";

const routerAuth = express.Router()

// POST Register
routerAuth.post('/register', RegisterValidation, validation, registerUser)
// GET Verify Email
routerAuth.get('/user/verify/:id/:token', verifyEmail)
// POST Login
routerAuth.post('/login', LoginValidation, validation, loginUser)
// GET refresh token
routerAuth.get('/token', refreshToken)
// GET Admin Auth
routerAuth.get('/admin', verifyTokenAuthAdmin)
// DELETE Logout
routerAuth.delete('/logout', Logout)

export default routerAuth