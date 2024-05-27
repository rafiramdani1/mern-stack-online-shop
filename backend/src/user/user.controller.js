import express from 'express'
import { userService } from './user.service.js'
import { jwtDecode } from 'jwt-decode'

const getProfileById = async (req, res) => {
  try {
    const token = req.cookies.refreshToken
    const decode = jwtDecode(token)
    const user = await userService.getProfileById(decode?.userId)
    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({
      status: false,
      msg: error.message
    })
  }
}

const addUserDetail = async (req, res) => {
  try {
    const data = req.body
    await userService.addUserDetails(data)
    res.status(200).json({
      status: true,
      msg: 'Data edited successfully!'
    })
  } catch (error) {
    res.status(400).json({
      status: false,
      msg: error.message
    })
  }
}

export const userController = {
  getProfileById,
  addUserDetail
}