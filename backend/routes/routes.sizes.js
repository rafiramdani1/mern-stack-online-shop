import express from 'express'
import { getSizes } from '../controllers/admin/sizes.controllers.js'

const routerSizes = express.Router()

// get sizes
routerSizes.get('/', getSizes)

export default routerSizes