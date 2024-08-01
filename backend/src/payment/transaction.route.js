import express from 'express'
import { createTrasaction, getSnapRedirectUrl } from './transaction.controller.js'

const routerTrasaction = express.Router()

routerTrasaction.post('/', createTrasaction)
routerTrasaction.get('/snap/:snapToken', getSnapRedirectUrl)

export default routerTrasaction