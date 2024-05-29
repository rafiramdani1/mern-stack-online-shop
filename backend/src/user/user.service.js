import mongoose from "mongoose"
import { userRepository } from "./user.repository.js"

const getProfileById = async (idUser) => {
  const user = await userRepository.findUserProfile(idUser)
  if (!user) {
    throw Error('user not found')
  }
  return user
}

const addUserDetails = async (data) => {
  await getProfileById(data.userId)

  // cek duplicate username
  const findUsername = await userRepository.findUserByUsername(
    {
      $regex: new RegExp('^' + data.username + '$', 'i')
    }
  )
  if (findUsername && data.userId != findUsername._id) {
    throw Error('username has been used!')
  }

  // cek duplicate email
  const findUserEmail = await userRepository.findUserByEmail(data.email)
  if (findUserEmail && data.userId != findUserEmail._id) {
    throw Error('email has been used!')
  }

  // cek duplicate phone
  const findUserPhone = await userRepository.findUserByPhone(data.phone)
  if (findUserPhone && data.userId != findUserPhone.user_id) {
    throw Error('phone has been used!')
  }

  const user = await userRepository.insertUserDetails(data)
  return user
}

const addShippingAddress = async (data) => {

  // cek user id
  await getProfileById(data.userId)

  // cek shipping data max 3 from user
  const shippingUser = await userRepository.findShippingAddressByUserId(data.userId)
  const maxShippingAddresUser = 3
  if (shippingUser[0]?.addresses?.length >= maxShippingAddresUser) {
    throw Error('You cannot add shipping address, because you have 3 shipping address!')
  }

  const userShippingAddress = await userRepository.insertShippingAddress(data)
  return userShippingAddress
}

const updateShippingAddress = async (data) => {
  const shipping = await userRepository.findShippingAddressById(data.userId, data.shippingId)
  if (!shipping) {
    throw Error('Shipping user not found!')
  }

  const updateShipping = await userRepository.updateShippingAddress(data)
  return updateShipping
}

const deleteShippingAddress = async (data) => {

  const shipping = await userRepository.findShippingAddressById(data.userId, data.shippingId)
  if (!shipping) {
    throw Error('Shipping user not found!')
  }

  const getShippingByUserId = await userRepository.findShippingAddressByUserId(data.userId)
  const minShippingAddressUser = 1
  if (getShippingByUserId[0]?.addresses?.length <= minShippingAddressUser) {
    throw Error('You must have at least one shipping address')
  }

  const deleteShipping = await userRepository.deleteShippingAddress(data)
  return deleteShipping
}

export const userService = {
  getProfileById,
  addUserDetails,
  addShippingAddress,
  updateShippingAddress,
  deleteShippingAddress
}