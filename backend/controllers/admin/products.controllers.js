import Product from "../../models/product.model.js";
import sizeProductModel from "../../models/sizeProduct.model.js"
import sizeAll from "../../models/size.model.js"
import Cart from "../../models/cart.model.js";
import { unlink } from "fs";
import path from "path";
import jwt from "jsonwebtoken";

// GET Product All
export const getProducts = async (req, res) => {
  try {
    const response = await Product.find({}).populate('id_category').populate('id_sub_category')
    res.json(response)
  } catch (error) { console.log(error.message) }
}

// GET product by title/name
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('id_category').populate('id_sub_category')
    if (!product) return res.status(404).json({ msg: 'no data' })
    const sizeProduct = await sizeProductModel.find({ id_product: req.params.id }).sort({ size: 1 })
    return res.json({ sizeProduct, product })
  } catch (error) { return res.status(404).json({ msg: error.message }) }
}

// get product by slug
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('id_category').populate('id_sub_category')
    const sizeProduct = await sizeProductModel.find({ id_product: product._id }).sort({ size: 1 })
    res.json({ product, sizeProduct })
  } catch (error) { console.log(error) }
}

export const getSizeProductByIdProduct = async (req, res) => {
  try {
    const sizeProduct = await sizeProductModel.find({ id_product: req.params.id })
    return res.json(sizeProduct)
  } catch (error) {
    console.log(error)
  }
}

export const getSizeProductById = async (req, res) => {
  try {
    const sizeProduct = await sizeProductModel.findOne({ _id: req.params.id })
    return res.json(sizeProduct)
  } catch (error) { console.log(error) }
}

export const getSizeAll = async (req, res) => {
  try {
    const size = await sizeAll.find({})
    return res.json({ size })
  } catch (error) { console.log(error) }
}

export const searchProduct = async (req, res) => {
  try {
    // const searchQuery = req.query.q
    // const products = await Product.find()
    // const options = {
    //   keys: ['title'],
    //   threshold: 0.3
    // }
    // const fuse = new Fuse(products, options)
    // const results = fuse.search(searchQuery)

    // const arrTitle = results[0].item.title

    // console.log(arrTitle.split(' '))
    // if (searchQuery.length === 0) return res.status(400).json({ msg: 'Produk tidak ditemukan' })
    // if (results.length === 0) return res.status(404).json({ msg: `Produk dengan kata kunci "${searchQuery}" tidak ditemukan` })
    // return res.json(results)

    const searchTerm = req.query.q

    const products = await Product.find()

    const options = {
      keys: ['title', 'category'],
      threshold: 0.3,
    }

    const fuse = new Fuse(products, options)
    const results = fuse.search(searchTerm)

    const productKeywords = products.map(product => product.title.toLowerCase().split(' '))
    let suggestKeyword = ''

    console.log(productKeywords)
    for (let i = 0; i < productKeywords.length; i++) {
      for (let j = 0; j < productKeywords[i].length; j++) {
        const word = productKeywords[i][j]
        const rating = stringSimilarity.compareTwoStrings(word, searchTerm.toLowerCase())

        if (rating > 0.7) {
          suggestKeyword = word
          break
        }
        // if (suggestKeyword.length > 0) break
      }
    }

    res.json({ results, suggestKeyword });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
}

// POST Add Product
export const AddProduct = async (req, res) => {
  if (req.files === null) return res.status(400).json({ msg: 'Tidak ada file yang diupload!' })
  const title = req.body.title
  const slug = req.body.slug
  const description = req.body.description
  const category = req.body.category
  let subCategory = req.body.subCategoryId
  const price = req.body.price
  const file = req.files.file
  const fileSize = file.data.length
  const ext = path.extname(file.name)
  const fileName = file.md5 + ext
  const url = `${req.protocol}://${req.get('host')}/images/${fileName}`
  const allowType = ['.png', '.jpg', '.jpeg']
  if (!allowType.includes(ext.toLowerCase())) return res.status(422).json({ msg: 'Yang anda upload bukan gambar!' })
  if (fileSize > 6000000) return res.status(422).json({ msg: 'Ukuran gambar tidak boleh lebih dari 5 MB' })

  const products = await Product.find({})
  let matchesTitle = false
  let matchesSlug = false
  for (let i = 0; i < products.length; i++) {
    const titleDb = products[i].title.toLowerCase()
    const slugDb = products[i].slug
    if (title.toLowerCase() === titleDb) {
      matchesTitle = true
      break
    }
    if (slug === slugDb) {
      matchesSlug = true
      break
    }
  }

  if (matchesTitle) return res.status(400).json({ msg: 'Title sudah digunakan!' })
  if (matchesSlug) return res.status(400).json({ msg: 'Slug sudah digunakan!' })

  file.mv(`./public/images/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message })
    try {
      const data = await new Product({ title, slug, description, id_category: category, id_sub_category: subCategory, price, image: fileName, url }).save()
      res.status(201).json({ msg: 'Produk berhasil ditambahkan!' })
    } catch (error) { console.log(error.message) }
  })
}

// PUT Edit Product
export const editProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    const { title, oldTitle, slug, oldSlug, description, price, category, subCategoryId } = req.body

    const products = await Product.find({})
    let matchesTitle = false
    let matchesSlug = false

    for (let i = 0; i < products.length; i++) {
      // cek duplicate title
      if (title.toLowerCase() === products[i].title.toLowerCase() && title.toLowerCase() !== oldTitle.toLowerCase()) {
        matchesTitle = true
        break
      }
      // cek duplicate slug
      if (slug.toLowerCase() === products[i].slug.toLowerCase() && slug.toLowerCase() !== oldSlug.toLowerCase()) {
        matchesSlug = true
        break
      }
    }

    if (matchesTitle) return res.status(400).json({ msg: 'Title sudah digunakan!' })
    if (matchesSlug) return res.status(400).json({ msg: 'Slug sudah digunakan!' })

    let fileName
    let file
    if (req.files === null) {
      fileName = req.body.image
    } else {
      file = req.files.image
      const filesize = file.data.length
      const ext = path.extname(file.name)
      fileName = file.md5 + ext
      const allowType = ['.png', '.jpg', '.jpeg']

      // Validation Extension Image
      if (!allowType.includes(ext.toLowerCase())) return res.status(422).json({ msg: 'Yang anda inputkan bukan Gambar!! (png, jpg, jpeg)' })
      // // Validation File Size
      if (filesize > 6000000) return res.status(422).json({ msg: 'Gambar tidak boleh dari 6 MB' })

      // update image
      const filePath = `./public/images/${product.image}`
      unlink(filePath, (err) => {
        if (err) return console.log(err)
      })

      file.mv(`./public/images/${fileName}`, (err) => { if (err) return res.status(500).json({ msg: err.message }) })
    }

    const url = `${req.protocol}://${req.get('host')}/images/${fileName}`
    await Product.updateOne({ _id: req.params.id }, { $set: { title, slug, description, price, id_category: category, id_sub_category: subCategoryId, url, image: fileName } })

    res.status(200).json({ msg: 'Produk berhasil diubah!' })

  } catch (error) { console.log(error) }
}

// DELETE Product By ID
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    await sizeProductModel.deleteMany({ id_product: req.params.id })
    const filePath = `./public/images/${product.image}`
    unlink(filePath, (err) => {
      if (err) return console.log(err)
    })
    return res.status(200).json({ msg: 'Product has been deleted!' })
  } catch (error) { console.log(error) }
}

// ADD SIZE PRODUCT
export const addSizeProduct = async (req, res) => {
  try {
    const { addSize, idProduct, addStock } = req.body
    const duplicate = await sizeProductModel.findOne({ id_product: idProduct, size: addSize })
    if (duplicate) return res.status(400).json({ msg: 'size sudah ada!' })
    await new sizeProductModel({ size: addSize, id_product: idProduct, stock: addStock }).save()
    return res.status(200).json({ msg: 'ukuran dan stok berhasil ditambahkan' })
  } catch (error) { console.log(error) }
}

// EDIT SIZE PRODUCT
export const EditSizeProduct = async (req, res) => {
  try {
    const { size, oldSize, stock, idSizeProduct } = req.body
    if (size === '') return res.status(400).json({ msg: 'Ukuran tidak boleh kosong!' })
    if (stock === '') return res.status(400).json({ msg: 'Stok tidak boleh kosong!' })
    const duplicateSize = await sizeProductModel.findOne({ size })
    if (duplicateSize && size !== oldSize) return res.status(400).json({ msg: 'Ukuran sudah ada!' })
    if (duplicateSize && size != oldSize) return res.status(400).json({ msg: 'Ukuran sudah ada!' })
    await sizeProductModel.updateOne({ _id: idSizeProduct }, { $set: { size, stock } })
    return res.status(200).json({ msg: 'Ukuran berhasil diubah!' })
  } catch (error) { console.log(error) }
}

// DELETE SIZE PRODUCT BY ID
export const DeleteSizeProductById = async (req, res) => {
  try {
    await sizeProductModel.findByIdAndDelete({ _id: req.params.id })
    return res.status(200).json({ msg: 'Ukuran produk berhasil dihapus!', status: true })
  } catch (error) { console.log(error) }
}

// add cart
export const addCart = async (req, res) => {
  try {
    const { cartSizeId, qty, cartNote, total, idProduct, idUser } = req.body
    await new Cart({ size: cartSizeId, qty, noted: cartNote, total, productId: idProduct, userId: idUser }).save()
    return res.status(200).json({ msg: 'Produk berhasil ditambahkan ke keranjang' })
  } catch (error) {
    console.log(error)
  }
}

// GET Carts By User Id
export const getCarts = async (req, res) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) return res.status(401)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, async (err, decoded) => {
    if (err) return res.sendStatus(403)
    try {
      const carts = await Cart.find({ userId: decoded.userId })
      res.json(carts)
    } catch (error) {
      console.log(error.response)
    }
  })
}