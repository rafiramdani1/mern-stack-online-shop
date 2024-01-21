import mongoose from "mongoose"
import { productsRepository } from "./product.repository.js"
import path from 'path'
import { unlink } from "fs"

const getAllProducts = async () => {
  const products = await productsRepository.findAllProducts()
  return products
}

const getProductById = async (id) => {
  // cek type id
  if (!mongoose.Types.ObjectId.isValid(id)) throw Error('Product tidak ditemukan!')

  const products = await productsRepository.findProductById(id)
  if (!products) throw Error('Produk tidak ditemukan!')

  return products
}

const getProductBySlug = async (slug) => {
  const product = await productsRepository.findProductBySlug(slug)
  if (!product) throw Error('Product tidak ditemukan!')
  return product
}

const createProduct = async (dataNewProduct) => {
  // cek type file
  if (!(dataNewProduct.allowType).includes((dataNewProduct.ext).toLowerCase())) {
    throw Error("Yang anda upload bukan gambar!")
  }
  // cek size file
  if (dataNewProduct.fileSize > 6000000) {
    throw Error('Ukuran gambar tidak boleh datri 5 MB')
  }

  // cek duplicate title
  const findProductByTitle = await productsRepository.findProductByTitle(
    { $regex: new RegExp('^' + dataNewProduct.newProduct.title + '$', 'i') }
  )
  if (findProductByTitle) throw Error('Title sudah digunakan!')

  // cek duplicate slug
  const findProductBySlug = await productsRepository.findProductBySlug(dataNewProduct.newProduct.slug)
  if (findProductBySlug.product !== null) throw Error('Slug sudah digunakan!')

  // save file image
  dataNewProduct.file.mv(`./public/images/${dataNewProduct.fileName}`, async (err) => {
    if (err) throw Error(err)
    const product = await productsRepository.insertProduct(dataNewProduct)
    return product
  })
}

const editProduct = async (dataProduct) => {
  // cek type id
  const product = await getProductById(dataProduct.idProduct)

  // cek duplicate title
  const findProductByTitle = await productsRepository.findProductByTitle(
    { $regex: new RegExp('^' + dataProduct.body.title + '$', 'i') }
  )
  if (findProductByTitle && (dataProduct.body.title).toLowerCase() !== (dataProduct.body.oldTitle).toLowerCase()) {
    throw Error('Title sudah digunakan!')
  }

  // cek duplicate slug
  const findProductBySlug = await productsRepository.findProductBySlug(dataProduct.body.slug)
  if (findProductBySlug.product && (dataProduct.body.slug).toLowerCase() !== (dataProduct.body.oldSlug).toLowerCase()) {
    throw Error('Slug sudah digunakan!')
  }

  let fileName
  let file
  if (dataProduct.reqFiles === null) {
    fileName = dataProduct.body.image
  } else {
    file = dataProduct.reqFiles.image
    const fileSize = file.data.length
    const ext = path.extname(file.name)
    fileName = file.md5 + ext
    const allowType = ['.png', '.jpg', '.jpeg']

    // validation ext image
    if (!allowType.includes(ext.toLowerCase())) {
      throw Error('Yang anda inputkan bukan Gambar!! (png, jpg, jpeg)')
    }
    // validation file size
    if (fileSize > 6000000) throw Error('Gambar tidak boleh lebih dari 6 MB')

    // update image
    const filePath = `./public/images/${product.product.image}`
    unlink(filePath, (err) => {
      if (err) return console.log(err)
    })

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return console.log(err)
    })
  }

  const url = `${dataProduct.reqProtocol}://${dataProduct.reqGetHost}/images/${fileName}`
  const dataNewProduct = {
    idProduct: dataProduct.idProduct,
    title: dataProduct.body.title,
    slug: dataProduct.body.slug,
    description: dataProduct.body.description,
    price: dataProduct.body.price,
    id_category: dataProduct.body.category,
    id_sub_category: dataProduct.body.subCategoryId,
    url,
    image: fileName
  }

  const newProduct = await productsRepository.updateProduct(dataNewProduct)
  return newProduct
}

const deleteProductById = async (idProduct) => {
  // cek type id
  await getProductById(idProduct)
  const product = await productsRepository.deleteProductById(idProduct)

  const filePath = `./public/images/${product.image}`
  unlink(filePath, (err) => {
    if (err) return console.log(err)
  })
  return product
}

const getSizeProductById = async (idSizeProduct) => {
  // cek type id
  if (!mongoose.Types.ObjectId.isValid(idSizeProduct)) {
    throw Error('Size produk tidak ditemukan!')
  }
  const sizeProduct = await productsRepository.findSizeProductById(idSizeProduct)
  if (!sizeProduct) throw Error('Size produk tidak ditemukan!')

  return sizeProduct
}

const getSizeProductByIdProduct = async (idProduct) => {
  const sizeProduct = await productsRepository.findSizeProductByIdProductAndSize(idProduct)
}

const createSizeProduct = async (dataProduct) => {
  // cek duplicate size
  const findSizeProductByIdProduct = await productsRepository.findSizeProductByIdProductAndSize(dataProduct)
  if (findSizeProductByIdProduct) {
    throw Error('size sudah ada!')
  }

  const sizeProduct = await productsRepository.insertSizeProduct(dataProduct)
  return sizeProduct
}

const editSizeProductById = async (dataSizeProduct) => {
  await getSizeProductById(dataSizeProduct.idSizeProduct)

  if (dataSizeProduct.size === "") throw Error('Ukuran tidak boleh kosong!')
  if (dataSizeProduct.stock === "") throw Error('Stok tidak boleh kosong!')

  const sizeProduct = await productsRepository.updateSizeProduct(dataSizeProduct)
  return sizeProduct
}

const deleteSizeProductById = async (idSizeProduct) => {
  await getSizeProductById(idSizeProduct)
  const sizeProduct = await productsRepository.deleteSizeProductById(idSizeProduct)
  return sizeProduct
}

export const productsService = {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  editProduct,
  deleteProductById,
  getSizeProductById,
  createSizeProduct,
  editSizeProductById,
  deleteSizeProductById,
}