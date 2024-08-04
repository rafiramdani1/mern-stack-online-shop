import express from 'express'
import { createTrasaction, getSnapRedirectUrl, transactionNotification } from './transaction.controller.js'

const routerTrasaction = express.Router()

routerTrasaction.post('/', createTrasaction)
routerTrasaction.get('/snap/:snapToken', getSnapRedirectUrl)
routerTrasaction.post('/notification', transactionNotification)

export default routerTrasaction