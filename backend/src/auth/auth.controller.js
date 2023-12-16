import { authService } from "./auth.service.js"
import { userRepository } from "../user/user.repository.js"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

// Registrasi user
const registrasi = async (req, res) => {
  try {
    const newUserData = req.body

    await authService.createUser(newUserData)
    res.status(201).json({
      status: true,
      msg: 'Registrasi berhasil, silahkan cek email untuk verifikasi.'
    })
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        status: false,
        msg: error.message
      });
    } else {
      res.status(400).json(error);
    }
  }
}

// login
const login = async (req, res) => {
  try {
    const userData = req.body
    const user = await authService.loginUser(userData)

    res.cookie('refreshToken', user.refreshToken, {
      httpOnly: true, maxAge: 24 * 60 * 60 * 1000
    })
    res.status(200).json({
      status: true,
      accessToken: user.accessToken,
      msg: 'Login berhasil'
    })
  } catch (error) {
    res.status(400).json({
      status: false,
      msg: error.msg
    });
  }
}

// verify email registrasi
const verifyEmail = async (req, res) => {
  try {
    const userId = req.params.id
    const userToken = req.params.token

    await authService.verifyEmail(userId, userToken)
    res.status(200).json({
      status: true,
      msg: 'Akun telah terverifikasi, silahkan login.'
    })

  } catch (error) {
    res.status(400).json({
      status: false,
      msg: error.msg
    });
  }
}

// refresh token
const refreshToken = async (req, res) => {
  // cek token
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) return res.sendStatus(401)

  // cek user
  const user = await userRepository.findUserByRefreshToken(refreshToken)
  if (!user) return res.sendStatus(401)

  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
      if (err) return res.sendStatus(403)
      const data = {
        userId: decoded.userId,
        username: decoded.username,
        email: decoded.email,
        roleId: decoded.roleId
      }
      const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN, {
        expiresIn: '15s'
      })
      res.json({ accessToken })
    })
  } catch (error) {
    res.status(400).send(error)
  }
}

// logout
const logout = async (req, res) => {
  try {
    // cek refresh token
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(204)

    // cek user token
    const user = await userRepository.findUserByRefreshToken(refreshToken)
    if (!user) return res.sendStatus(204)

    // update refresh = null
    await userRepository.updateRefreshToken(user._id, null)

    res.clearCookie('refreshToken')
    res.status(200).json({
      status: true,
      msg: 'Logout berhasil!'
    })
  } catch (error) {
    res.status(400).send(error)
  }
}

export const authController = {
  registrasi,
  verifyEmail,
  login,
  refreshToken,
  logout,
}