import sizeProductModel from '../../models/sizeProduct.model.js'

const findSizeProductByIdProduct = async (id) => {
  const sizesProduct = await sizeProductModel.find({
    id_product: id
  }).sort({ size: 1 })
  return sizesProduct
}

export const sizeRepository = {
  findSizeProductByIdProduct,
}

