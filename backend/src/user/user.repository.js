import mongoose from "mongoose"
import Users from "../../models/users.model.js"
import { authRepository } from "../auth/auth.repository.js"
import crypto from 'crypto'

// create user / registrasi
const insertUser = async (newUser) => {
  const user = await new Users({
    username: newUser.username,
    email: newUser.email,
    password: newUser.password,
    roleId: newUser.roleId
  }).save()

  const tokenExp = Date.now() + 3600000 // 1 hours
  await authRepository.createTokenRegistrasi({
    userId: user._id,
    token: crypto.randomBytes(32).toString('hex'),
    verifyExp: tokenExp,
    email: user.email
  })

  return user
}

// find user by id
const findUserById = async (id) => {
  const user = await Users.findOne(id)
  return user
}

// find user by username
const findUserByUsername = async (username) => {
  const user = await Users.findOne({ username })
  return user
}

// find user by email
const findUserByEmail = async (email) => {
  const user = await Users.findOne({ email }).populate('roleId')
  return user
}

// find user by refresh token
const findUserByRefreshToken = async (refreshToken) => {
  const user = await Users.findOne({ refresh_token: refreshToken })
  return user
}

// find user by verify account user
const findUserByVerified = async (id) => {
  const user = await Users.findOne({ _id: id, verified: true })
  return user
}

// update refresh token user login
const updateRefreshToken = async (id, refreshToken) => {
  const user = await Users.updateMany({ _id: id }, {
    $set: { refresh_token: refreshToken }
  })
  return user
}

export const userRepository = {
  insertUser,
  findUserById,
  findUserByUsername,
  findUserByEmail,
  findUserByRefreshToken,
  checkVerifyAccountUser: findUserByVerified,
  updateRefreshToken,
}