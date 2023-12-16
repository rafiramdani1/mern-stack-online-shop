import express from 'express'
import { productContollers } from './product.controller.js'

export const productRouter = express.Router()

productRouter.get('/', productContollers.getProducts)
productRouter.get('/:id', productContollers.getProductById)