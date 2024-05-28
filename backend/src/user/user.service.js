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
  const findUsername = await userRepository.findUserByUsername(data.username)
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
  console.log(findUserPhone)
  if (findUserPhone && data.userId != findUserPhone.user_id) {
    throw Error('phone has been used!')
  }

  const user = await userRepository.insertUserDetails(data)
  return user
}

export const userService = {
  getProfileById,
  addUserDetails
}