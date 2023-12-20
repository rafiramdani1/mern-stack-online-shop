import mongoose from "mongoose"
import { productsRepository } from "./product.repository.js"

const getAllProducts = async () => {
  const products = await productsRepository.findAllProducts()
  return products
}

const getProductById = async (id) => {
  // cek type id
  if (!mongoose.Types.ObjectId.isValid(id)) throw Error('Product tidak ditemukan!')

  const products = await productsRepository.findProductById(id)
  return products
}

export const productsService = {
  getAllProducts,
  getProductById,
}