import express from "express";
import { registerUser, loginUser, Logout } from "../controllers/auth.controllers.js";
import { validation, RegisterValidation, LoginValidation } from '../validation/index.js'
import { verifyEmail, verifyTokenAccessAdmin } from "../middleware/middleware.js";
import { refreshToken } from "../controllers/refreshToken.js";

const routerAuth = express.Router()

// END POINT

routerAuth.post('/register', RegisterValidation, validation, registerUser)

routerAuth.get('/user/verify/:id/:token', verifyEmail)

routerAuth.post('/login', LoginValidation, validation, loginUser)

routerAuth.get('/token', refreshToken)

routerAuth.delete('/logout', Logout)

routerAuth.get('/admin/dashboard', verifyTokenAccessAdmin, (req, res) => {
  res.status(200).json({ status: true, msg: 'success' })
})

export default routerAuth