import Users from "../models/users.model.js";
import Tokens from "../models/token.model.js";
import jwt from "jsonwebtoken";
import Product from "../models/product.model.js";

export const verifyTokenAuthAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) return res.sendStatus(403)
    if (decoded.role !== 'admin') return res.sendStatus(401)
    req.email = decoded.email
    next()
  })
}

export const verifyEmail = async (req, res) => {
  try {
    const users = await Users.findOne({ _id: req.params.id })
    const tokens = await Tokens.findOne({ userId: req.params.id, token: req.params.token })
    if (!users) return res.status(400).json({ msg: 'invalid link', status: false })
    if (!tokens) return res.status(400).json({ msg: 'invalid link', status: false })
    if (tokens.verifyExp < Date.now()) {
      await Tokens.findOneAndRemove({ userId: req.params.id, token: req.params.token })
      await Users.findOneAndRemove({ _id: req.params.id })
      return res.status(400).json({ msg: 'Token expired, please re-registered!', status: false })
    }
    await Users.updateOne({ _id: req.params.id }, { $set: { verified: true } })
    await Tokens.findOneAndRemove({ userId: req.params.id, token: req.params.token })
    return res.status(200).json({ msg: 'Account has been actived, please login!', status: true })
  } catch (error) { return res.status(400).json({ msg: 'invalid link', status: false }) }
}