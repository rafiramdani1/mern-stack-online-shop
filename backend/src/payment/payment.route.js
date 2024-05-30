import express from 'express'
import { getTokenPayment } from './payment.controller.js'

const routerPayment = express.Router()

routerPayment.post('/token', getTokenPayment)

export default routerPayment