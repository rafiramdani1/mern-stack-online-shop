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
  const user = await userRepository.insertUserDetails(data)
  return user
}

export const userService = {
  getProfileById,
  addUserDetails
}