import express from 'express'
import { getProducts, AddProduct, editProduct, deleteProduct, getProductById, getProductBySlug, getSizeProductById, addSizeProduct, EditSizeProduct, DeleteSizeProductById, addCart, getSizeProductByIdProduct, getCarts, deleteCartById, getProductsByCategory, searchProducts } from '../controllers/admin/products.controllers.js'
import { validation, addProductValidation, addSizeProductValidation, editSizeStockProduct } from '../validation/index.js'

const routerProduct = express.Router()

// get products
routerProduct.get('/', getProducts)
routerProduct.get('/:id', getProductById)
routerProduct.get('/category/:category', getProductsByCategory)
// Post Add Product
routerProduct.post('/', addProductValidation, validation, AddProduct)
// edit product
routerProduct.put('/:id', addProductValidation, validation, editProduct)
// delete product
routerProduct.delete('/:id', deleteProduct)
routerProduct.get('/slug/:slug', getProductBySlug)


routerProduct.get('/size/id-product/:id', getSizeProductByIdProduct)
routerProduct.get('/size/:id', getSizeProductById)
routerProduct.get('/products/search', searchProducts)

// add size product
routerProduct.post('/sizes', addSizeProductValidation, validation, addSizeProduct)

// edit size & stock product
routerProduct.put('/size/edit', EditSizeProduct)
// delete size product
routerProduct.delete('/delete/size/:id', DeleteSizeProductById)

// add cart
routerProduct.post('/add-cart', addCart)

// get carts
routerProduct.get('/api/carts', getCarts)

routerProduct.delete('/cart/delete/:id', deleteCartById)

export default routerProduct