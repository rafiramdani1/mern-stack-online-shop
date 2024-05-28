import mongoose from "mongoose"
import Users from "../../models/users.model.js"
import { authRepository } from "../auth/auth.repository.js"
import crypto from 'crypto'
import UserDetails from "../../models/user_details.model.js"

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
  const user = await Users.findById(id)
  return user
}

// find User Profile
const findUserProfile = async (id) => {
  const ObjectId = mongoose.Types.ObjectId

  const findUser = await Users.aggregate([
    {
      $lookup: {
        from: 'user_details',
        localField: '_id',
        foreignField: 'user_id',
        as: 'user_details'
      }
    },
    {
      $unwind: '$user_details'
    },
    {
      $match: {
        _id: new ObjectId(id)
      }
    },
    {
      $project: {
        _id: 1, // Exclude _id field from the output
        username: 1,
        email: 1,
        user_details: 1,
      }
    }
  ]);

  return findUser[0]
}

const findUserDetailsById = async (idUser) => {
  const user = await UserDetails.findOne({ user_id: idUser })
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
  const user = await Users.findOne({ refresh_token: refreshToken }).populate('roleId')
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

const insertOrUpdateUserDetails = async (data) => {
  const user = await Users.updateOne(
    { _id: data.userId }, {
    $set: {
      username: data.username,
      email: data.email
    }
  })

  let userDetails

  const findUserDetails = await findUserDetailsById(data.userId)
  if (findUserDetails) {
    userDetails = await UserDetails.updateOne(
      { user_id: data.userId }, {
      $set: {
        user_id: data.userId,
        fullname: data.fullname,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        phone: data.phone
      }
    }
  )
  } else {
    userDetails = await new UserDetails({
      user_id: data.userId,
      fullname: data.fullname,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      phone: data.phone
    }).save()
  }


  return { user, userDetails }
}

export const userRepository = {
  insertUser,
  findUserById,
  findUserByUsername,
  findUserByEmail,
  findUserByRefreshToken,
  checkVerifyAccountUser: findUserByVerified,
  updateRefreshToken,
  findUserDetailsById,
  insertUserDetails: insertOrUpdateUserDetails,
  findUserProfile
}