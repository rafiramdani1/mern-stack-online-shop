import { productsService } from "./product.service.js"
import path from 'path'

const getProducts = async (req, res) => {
  try {
    const products = await productsService.getAllProducts()
    res.status(200).json(products)
  } catch (error) {
    res.status(400).json({
      status: false,
      msg: error.message
    })
  }
}

const getProductById = async (req, res) => {
  try {
    const productId = req.params.productId

    const product = await productsService.getProductById(productId)
    res.json(product)
  } catch (error) {
    res.status(400).json({
      status: false,
      msg: error.message
    })
  }
}

const getProductBySlug = async (req, res) => {
  try {
    const productSlug = req.params.productSlug

    const product = await productsService.getProductBySlug(productSlug)
    res.json(product)
  } catch (error) {
    res.status(400).json({
      status: false,
      msg: error.message
    })
  }
}

const addProduct = async (req, res) => {
  try {
    if (req.files == null) throw Error("Tidak ada file yang diupload!")

    const newProduct = req.body
    const files = req.files
    const file = files?.file
    const fileSize = file?.data?.length
    const ext = path.extname(file.name)
    const fileName = file.md5 + ext
    const url = `${req.protocol}://${req.get('host')}/images/${fileName}`
    const allowType = ['.png', '.jpg', '.jpeg']

    const dataNewProduct = {
      newProduct, fileSize, url, allowType, fileName, ext, file
    }

    await productsService.createProduct(dataNewProduct)
    res.status(200).json({
      status: true,
      msg: 'Produk berhasil ditambahkan!'
    })

  } catch (error) {
    console.log(error)
    res.status(400).json({
      status: false,
      msg: error.message
    })
  }
}

const editProduct = async (req, res) => {
  try {
    const reqFiles = req.files
    const idProduct = req.params.id
    const body = req.body
    const reqProtocol = req.protocol
    const reqGetHost = req.get('host')

    const dataProduct = {
      reqFiles, idProduct, body, reqProtocol, reqGetHost
    }

    await productsService.editProduct(dataProduct)
    res.status(200).json({
      status: true,
      msg: 'Produk berhasil diubah!'
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      status: false,
      msg: error.message
    })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id
    await productsService.deleteProductById(productId)
    res.status(200).json({
      status: true,
      msg: 'Produk berhasil dihapus!'
    })
  } catch (error) {
    res.status(400).json({
      status: false,
      msg: error.message
    })
  }
}

const getSizeProductById = async (req, res) => {
  try {
    const idSizeProduct = req.params.id

    const sizeProduct = await productsService.getSizeProductById(idSizeProduct)
    res.json({
      status: true,
      data: sizeProduct
    })
  } catch (error) {
    res.status(400).json({
      status: false,
      msg: error.message
    })
  }
}

const addSizeProduct = async (req, res) => {
  try {
    const dataProduct = req.body

    await productsService.createSizeProduct(dataProduct)
    res.status(200).json({
      status: true,
      msg: 'ukuran dan stok berhasil ditambahkan'
    })
  } catch (error) {
    res.status(400).json({
      status: false,
      msg: error.message
    })
  }
}

const editSizeProductById = async (req, res) => {
  try {
    const dataSizeProduct = req.body
    await productsService.editSizeProductById(dataSizeProduct)
    res.status(200).json({
      status: true,
      msg: 'ukuran dan stok berhasil diubah!'
    })
  } catch (error) {
    res.status(400).json({
      status: false,
      msg: error.message
    })
  }
}

const deleteSizeProductById = async (req, res) => {
  try {
    const idSizeProduct = req.params.id
    await productsService.deleteSizeProductById(idSizeProduct)
    res.status(200).json({
      status: true,
      msg: 'ukuran dan stok berhasil dihapus!'
    })
  } catch (error) {
    res.status(400).json({
      status: false,
      msg: error.message
    })
  }
}

export const productContollers = {
  getProducts,
  getProductById,
  getProductBySlug,
  addProduct,
  editProduct,
  deleteProduct,
  getSizeProductById,
  addSizeProduct,
  editSizeProductById,
  deleteSizeProductById
}