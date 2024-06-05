import express from 'express'
import { userService } from './user.service.js'
import { jwtDecode } from 'jwt-decode'
import path from 'path'

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

const getShippingAddressByUserId = async (req, res) => {
  try {
    const token = req.cookies.refreshToken
    const decode = jwtDecode(token)
    const shippingAddress = await userService.getShippingAddressByUserId(decode.userId)
    res.status(200).json({
      status: true,
      data: shippingAddress
    })
  } catch (error) {
    res.status(400).json({
      status: 400,
      msg: error.message
    })
  }
}

const addShippingAddress = async (req, res) => {
  try {
    const data = req.body
    await userService.addShippingAddress(data)
    res.status(200).json({
      status: true,
      msg: 'Shipping address added successfully!'
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      status: false,
      msg: error.message
    })
  }
}

const updateShippingAddress = async (req, res) => {
  try {
    const data = req.body
    await userService.updateShippingAddress(data)
    res.status(200).json({
      status: true,
      msg: 'Shipping updated successfully!',
    })
  } catch (error) {
    res.status(400).json({
      status: 400,
      msg: error.message
    })
  }
}

const deleteShippingAddress = async (req, res) => {
  try {
    const data = req.body
    await userService.deleteShippingAddress(data)
    res.status(200).json({
      status: true,
      msg: "Shipping deleted successfully!"
    })
  } catch (error) {
    res.status(400).json({
      status: false,
      msg: error.message
    })
  }
}

const updateStatusShippingToTrue = async (req, res) => {
  try {
    const data = req.body
    const shipping = await userService.updateStatusShippingToTrue(data)
    res.status(200).json({
      status: true,
      msg: 'The sender address has been successfully changed!',
    })
  } catch (error) {
    res.status(400).json({
      status: false,
      msg: error.message
    })
    console.log(error)
  }
}

const addImageProfile = async (req, res) => {
try {
    if (req.files == null) throw Error('File not found')

    const userId = req.body.userId
    const files = req.files
    const file = files?.file
    const fileSize = file?.data?.length
    const ext = path.extname(file.name)
    const fileName = file.md5 + ext
    const image_url = `${req.protocol}://${req.get('host')}/images/user_profile/${fileName}`
    const allowType = ['.png', '.jpg', '.jpeg']

    const data = {
      userId, fileSize, image_url, allowType, fileName, ext, file
    }

    await userService.uploadImageUserProfile(data)
    res.status(200).json({
      status: true,
      msg: 'Image has been changes!'
    })
  } catch (error) {
    res.status(400).json({
      status: false,
      msg: error.message
    })
  }
}

const updateImageProfile = async (req, res) => {
  try {
    if (req.files == null) throw Error('File not found')

    const userId = req.body.userId
    const imageId = req.body.imageId
    const files = req.files
    const file = files?.file
    const fileSize = file?.data?.length
    const ext = path.extname(file.name)
    const fileName = file.md5 + ext
    const image_url = `${req.protocol}://${req.get('host')}/images/user_profile/${fileName}`
    const allowType = ['.png', '.jpg', '.jpeg']

    const data = {
      userId, imageId, fileSize, image_url, allowType, fileName, ext, file
    }

    await userService.updateImageUserProfile(data)
    res.status(200).json({
      status: true,
      msg: 'Image profile updated successfully!'
    })
  } catch (error) {
    res.status(400).json({
      status: false,
      msg: error.message
    })
  }
}

const deleteImageProfile = async (req, res) => {
  try {

  } catch (error) {

  }
}

export const userController = {
  getProfileById,
  addUserDetail,
  addShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
  getShippingAddressByUserId,
  updateStatusShippingToTrue,
  addImageProfile,
  updateImageProfile
}