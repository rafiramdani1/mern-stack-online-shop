import express from 'express'
import { getProducts, AddProduct, editProduct, deleteProduct, getProductById, getProductBySlug, getSizeAll, getSizeProductById, searchProduct, addSizeProduct, EditSizeProduct, DeleteSizeProductById, addCart, getSizeProductByIdProduct, getCarts } from '../controllers/admin/products.controllers.js'
import { validation, addProductValidation, addSizeProductValidation, editSizeStockProduct } from '../validation/index.js'

const routerProduct = express.Router()

// get products
routerProduct.get('/', getProducts)
routerProduct.get('/:id', getProductById)
routerProduct.get('/productSize/sizes', getSizeAll)
routerProduct.get('/productSize/id-product/:id', getSizeProductByIdProduct)
routerProduct.get('/size/:id', getSizeProductById)
routerProduct.get('/products/:slug', getProductBySlug)
routerProduct.get('/products/search', searchProduct)

// Post Add Product
routerProduct.post('/add-product', addProductValidation, validation, AddProduct)
// edit product
routerProduct.put('/edit/:id', addProductValidation, validation, editProduct)
// delete product
routerProduct.delete('/delete/:id', deleteProduct)

// add size product
routerProduct.post('/add-size', addSizeProductValidation, validation, addSizeProduct)
// edit size & stock product
routerProduct.put('/size/edit', EditSizeProduct)
// delete size product
routerProduct.delete('/delete/size/:id', DeleteSizeProductById)

// add cart
routerProduct.post('/add-cart', addCart)

// get carts
routerProduct.get('/api/carts', getCarts)

export default routerProduct