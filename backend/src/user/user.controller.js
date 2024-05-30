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

export const userController = {
  getProfileById,
  addUserDetail,
  addShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
  getShippingAddressByUserId,
  updateStatusShippingToTrue
}