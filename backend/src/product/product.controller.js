import { productsService } from "./product.service.js"

const getProducts = async (req, res) => {
  try {
    const products = await productsService.getAllProducts()
    res.status(200).json(products)
  } catch (error) {
    res.status(400).json({
      msg: error.message
    })
  }
}

const getProductById = async (req, res) => {
  try {
    const productId = req.params.id

    const product = await productsService.getProductById(productId)
    res.json(product)
  } catch (error) {
    res.status(400).json({
      msg: error.message
    })
  }
}

export const productContollers = {
  getProducts,
  getProductById,
}