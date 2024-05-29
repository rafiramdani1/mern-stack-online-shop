import mongoose from "mongoose"
import Users from "../../models/users.model.js"
import { authRepository } from "../auth/auth.repository.js"
import crypto from 'crypto'
import UserDetails from "../../models/user_details.model.js"
import ShippingAddress from "../../models/shippingAddress.model.js"

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
      $unwind: {
        path: '$user_details',
        preserveNullAndEmptyArrays: true
      }
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

const findUserByPhone = async (phone) => {
  const user = await UserDetails.findOne({ phone })
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
      fullname: data?.fullname,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      phone: data?.phone
    }).save()
  }


  return { user, userDetails }
}

const findShippingAddressByUserId = async (userId) => {
  const userShippingAddress = await ShippingAddress.find({ user_id: userId })
  return userShippingAddress
}

const findShippingAddressById = async (userId, shippingId) => {
  const shipping = await ShippingAddress.findOne(
    {
      user_id: userId,
      'addresses._id': shippingId
    }, { 'addresses.$': 1 }
  )
  return shipping
}

const insertShippingAddress = async (data) => {

  const cekShippingUser = await findShippingAddressByUserId(data.userId)

  let userShippingAddress
  const dataShipping = {
    recipient_name: data.recipient_name,
    phone: data.phone,
    address_label: data.address_label,
    city: data.city,
    complete_address: data.complete_address,
    note_to_courier: data.note_to_courier,
    status: data.status
  }

  if (cekShippingUser.length <= 0) {
    userShippingAddress = await new ShippingAddress({
      user_id: data.userId,
      addresses: [dataShipping]
    }).save()
  } else {
    userShippingAddress = await ShippingAddress.updateOne(
      { user_id: data.userId },
      {
        $push: {
          addresses: [dataShipping]
        }
      }
    )
  }
  return userShippingAddress
}

const updateShippingAddress = async (data) => {
  const shipping = await ShippingAddress.updateOne(
    { user_id: data.userId, 'addresses._id': data.shippingId },
    {
      $set: {
        'addresses.$.recipient_name': data.recipient_name,
        'addresses.$.phone': data.phone,
        'addresses.$.address_label': data.address_label,
        'addresses.$.city': data.city,
        'addresses.$.complete_address': data.complete_address,
        'addresses.$.note_to_courier': data.note_to_courier,
        'addresses.$.status': data.status
      }
    }
  )

  return shipping
}

const deleteShippingAddress = async (data) => {
  const shipping = await ShippingAddress.updateOne(
    { user_id: data.userId },
    { $pull: { addresses: { _id: data.shippingId } } }
  )

  return shipping
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
  findUserProfile,
  findUserByPhone,
  findShippingAddressByUserId,
  insertShippingAddress,
  findShippingAddressById,
  updateShippingAddress,
  deleteShippingAddress
}