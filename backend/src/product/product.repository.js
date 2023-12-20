import Product from "../../models/product.model.js"
import { sizeRepository } from "../size/size.repository.js"

const findAllProducts = async () => {
  const products = await Product.find({}).populate('id_category').populate('id_sub_category')
  return products
}

const findProductById = async (id) => {
  const product = await Product.findById(id)
  const sizesProduct = await sizeRepository.findSizeProductByIdProduct(id)

  return { product, sizesProduct }
}

export const productsRepository = {
  findAllProducts,
  findProductById
}