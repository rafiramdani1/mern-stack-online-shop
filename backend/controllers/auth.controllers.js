import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { sendMail } from '../config/verifEmail.js'
import Users from "../models/users.model.js"
import Role from '../models/role.model.js'
import Tokens from '../models/token.model.js'

dotenv.config()

// Register
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body

    // cek duplicate username case-intensitive with regex
    const duplicateUsername = await Users.findOne({
      username: { $regex: new RegExp('^' + username + '$', 'i') }
    })
    if (duplicateUsername) return res.status(400).json({
      status: false,
      msg: 'Username sudah digunakan!'
    })

    // cek duplicate email
    const duplicateEmail = await Users.findOne({ email })
    if (duplicateEmail) return res.status(400).json({
      status: false,
      msg: 'Email sudah digunakan!'
    })

    // cek match password
    if (password !== confirmPassword) return res.status(400).json({ status: false, msg: 'Konfirmasi password tidak sama!' })

    // hash password
    const hashPassword = await bcrypt.hash(password, 10)

    // get user id role user (default)
    const role = await Role.findOne({ roleName: 'user' })
    if (!role) {
      return res.status(500).json({ status: false, msg: 'Internal server Error' })
    }

    // save user to db
    const user = await new Users({ username, email, password: hashPassword, roleId: role._id }).save()

    // save token to db
    const tokenExp = Date.now() + 3600000 // 1 hours
    const Usertoken = await new Tokens({
      userId: user._id,
      token: crypto.randomBytes(32).toString('hex'),
      verifyExp: tokenExp
    }).save()

    // send email verification
    const message = `Verifikasi akun anda : ${process.env.BASE_URL}/user/verify/${user._id}/${Usertoken.token}`
    await sendMail(user.email, 'Verifikasi account : ', message)

    // send response to client
    return res.status(200).json({ status: true, data: user, msg: 'Registrasi berhasil! cek email untuk verifikasi.' })

  } catch (error) {
    console.log(error)
  }
}

// Login
export const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body

    // cek email
    const user = await Users.findOne({ email }).populate('roleId')
    if (!user) return res.status(400).json({ status: false, msg: 'email / password salah!' })

    // cek password
    const matchPassword = await bcrypt.compare(password, user.password)
    if (!matchPassword) return res.status(400).json({ status: false, msg: 'email / password salah!' })

    // check verify account
    const verify = await Users.findOne({ _id: user._id, verified: true })
    if (!verify) return res.status(400).json({ status: false, msg: 'Akun anda belum terverifikasi, cek email anda!' })

    const data = {
      userId: user._id,
      username: user.username,
      email: user.email,
      roleId: user.roleId
    }

    // set access token jwt
    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN, { expiresIn: '15s' })
    const refreshToken = jwt.sign(data, process.env.REFRESH_TOKEN, { expiresIn: '1d' })

    // update refreshToken to db
    await Users.updateMany({ _id: data.userId }, { $set: { refresh_token: refreshToken } })

    // send accessToken to client and set cookies 
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    res.status(200).json({ status: true, accessToken, msg: 'Login berhasil' })
  } catch (error) {
    console.log(error)
  }
}

export const checkLoginStatus = async (req, res) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) return res.sendStatus(204)
  const user = await Users.findOne({ refresh_token: refreshToken })
  if (!user) return res.sendStatus(401)

  return res.status(200).json({ status: true, loggedIn: true })
}

// Logout
export const Logout = async (req, res) => {
  try {
    // cek refreshToken from cookies
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(204)

    // cek user token
    const user = await Users.findOne({ refresh_token: refreshToken })
    if (!user) return res.sendStatus(204)

    // update refreshToken db 
    await Users.updateMany({ _id: user._id }, { $set: { refresh_token: null } })
    res.clearCookie('refreshToken')
    return res.status(200).json({ status: true, msg: 'Logout berhasil!' })
  } catch (error) {
    console.log(error)
  }
}

