import Product from "../../models/product.model.js"
import sizeProductModel from '../../models/sizeProduct.model.js'

const findAllProducts = async () => {
  const products = await Product.find({}).populate('id_category').populate('id_sub_category')
  return products
}

const findProductById = async (id) => {
  const product = await Product.findById(id).populate('id_category').populate('id_sub_category')
  const sizesProduct = await findAllSizesProductByIdProduct(id)
  return { product, sizesProduct }
}

const findProductByTitle = async (title) => {
  const product = await Product.findOne({ title })
  return product
}

const findProductBySlug = async (slug) => {
  const product = await Product.findOne({ slug }).populate('id_category').populate('id_sub_category')
  const sizesProduct = await findAllSizesProductByIdProduct(product?._id)
  return { product, sizesProduct }
}

const insertProduct = async (productData) => {
  const product = await new Product({
    title: productData.newProduct.title,
    slug: productData.newProduct.slug,
    description: productData.newProduct.description,
    id_category: productData.newProduct.category,
    id_sub_category: productData.newProduct.subCategoryId,
    price: productData.newProduct.price,
    image: productData.fileName,
    url: productData.url
  }).save()
  return product
}

const updateProduct = async (dataNewProduct) => {
  const product = await Product.updateOne({ _id: dataNewProduct.idProduct }, {
    $set: {
      title: dataNewProduct.title,
      slug: dataNewProduct.slug,
      description: dataNewProduct.description,
      price: dataNewProduct.price,
      id_category: dataNewProduct.id_category,
      id_sub_category: dataNewProduct.id_sub_category,
      url: dataNewProduct.url,
      image: dataNewProduct.image
    }
  })
  return product
}

const deleteProductById = async (idProduct) => {
  const product = await Product.findByIdAndDelete(idProduct)
  await sizeProductModel.deleteMany({ id_product: idProduct })
  return product
}

const findSizeProductById = async (idSizeProduct) => {
  const sizeProduct = await sizeProductModel.findOne({ _id: idSizeProduct })
  return sizeProduct
}


const findSizeProductByIdProductAndSize = async (dataProduct) => {
  const sizeProduct = await sizeProductModel.findOne({
    id_product: dataProduct.idProduct,
    size: dataProduct.addSize
  })
  return sizeProduct
}

const findAllSizesProductByIdProduct = async (id) => {
  const sizesProduct = await sizeProductModel.find({
    id_product: id
  })
  return sizesProduct
}

const insertSizeProduct = async (dataProduct) => {
  const sizeProduct = await new sizeProductModel({
    size: dataProduct.addSize,
    id_product: dataProduct.idProduct,
    stock: dataProduct.addStock
  }).save()
  return sizeProduct
}

const updateSizeProduct = async (dataSizeProduct) => {
  const sizeProduct = await sizeProductModel.updateOne({
    _id: dataSizeProduct.idSizeProduct
  }, {
    $set: { size: dataSizeProduct.size, stock: dataSizeProduct.stock }
  })
  return sizeProduct
}

const deleteSizeProductById = async (idSizeProduct) => {
  const sizeProduct = await sizeProductModel.findByIdAndDelete({ _id: idSizeProduct })
  return sizeProduct
}

export const productsRepository = {
  findAllProducts,
  findProductById,
  findProductByTitle,
  findProductBySlug,
  insertProduct,
  updateProduct,
  deleteProductById,
  findSizeProductById,
  findAllSizesProductByIdProduct,
  findSizeProductByIdProductAndSize,
  insertSizeProduct,
  updateSizeProduct,
  deleteSizeProductById,
}