import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { sendMail } from '../config/verifEmail.js'
import Users from "../models/users.model.js"
import Tokens from '../models/token.model.js'

dotenv.config()

// Register
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body
    const duplicateUsername = await Users.findOne({ username })
    if (duplicateUsername) return res.status(400).json({ status: false, msg: 'Username has been registered!' })
    const duplicateEmail = await Users.findOne({ email })
    if (duplicateEmail) return res.status(400).json({ status: false, msg: 'Email has been registered!' })
    if (password !== confirmPassword) return res.status(400).json({ msg: 'Password confirmation is incorrect', status: false })
    const hashPassword = await bcrypt.hash(password, 10)
    const user = await new Users({ username, email, password: hashPassword }).save()
    const tokenExp = Date.now() + 3600000 // 1 hours
    const Usertoken = await new Tokens({ userId: user._id, token: crypto.randomBytes(32).toString('hex'), verifyExp: tokenExp }).save()
    const message = `${process.env.BASE_URL}/user/verify/${user._id}/${Usertoken.token}`
    await sendMail(user.email, 'verify email', message)
    return res.status(200).json({ msg: 'Registration has been successful, check your email', status: true })
  } catch (error) { console.log(error) }
}

// Login
export const loginUser = async (req, res) => {
  try {
    // input user
    const { email, password } = req.body
    // check email
    const user = await Users.find({ email })
    if (!user[0]) return res.status(400).json({ msg: 'email tidak terdaftar!', status: false })
    // check password
    const match = await bcrypt.compare(password, user[0].password)
    if (!match) return res.status(400).json({ msg: 'Password salah!', status: false })
    // check verify
    const verify = await Users.findOne({ _id: user[0]._id, verified: true })
    if (!verify) return res.status(400).json({ msg: 'Akun anda belum terverifikasi, cek email anda!', status: false })
    const userId = user[0]._id
    const name = user[0].username
    const emailUser = user[0].email
    const role = user[0].role
    const accessToken = jwt.sign({ userId, name, emailUser, role }, process.env.ACCESS_TOKEN, { expiresIn: '15s' })
    const refreshToken = jwt.sign({ userId, name, emailUser, role }, process.env.REFRESH_TOKEN, { expiresIn: '1d' })
    await Users.updateMany({ _id: userId }, { $set: { refresh_token: refreshToken } })
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    res.status(200).json({ status: false, accessToken })
  } catch (error) { console.log(error) }
}

// Logout
export const Logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(204)
    const user = await Users.findOne({ refresh_token: refreshToken })
    if (!user) return res.sendStatus(204)
    await Users.updateMany({ _id: user._id }, { $set: { refresh_token: null } })
    res.clearCookie('refreshToken')
    return res.sendStatus(200)
  } catch (error) { console.log(error) }
}

