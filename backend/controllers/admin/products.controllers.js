import Product from "../../models/product.model.js";
import sizeProductModel from "../../models/sizeProduct.model.js"
import Cart from "../../models/cart.model.js";
import { unlink } from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import Categories from "../../models/category.mode.js"

// GET Product All
export const getProducts = async (req, res) => {
  try {
    // get all products and populate data sub category and category
    const response = await Product.find({}).populate('id_category').populate('id_sub_category')
    res.json(response)
  } catch (error) {
    console.log(error.message)
  }
}

// GET product by id
export const getProductById = async (req, res) => {
  try {
    // get product by id in database and populate data
    const product = await Product.findById(req.params.id).populate('id_category').populate('id_sub_category')

    if (!product) return res.status(404).json({ msg: 'no data' })

    // get size products
    const sizeProduct = await sizeProductModel.find({
      id_product: req.params.id
    }).sort({ size: 1 })
    return res.json({ sizeProduct, product })
  } catch (error) {
    return res.status(404).json({
      msg: error.message
    })
  }
}

// get product by slug
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug
    }).populate('id_category').populate('id_sub_category')

    const sizeProduct = await sizeProductModel.find({
      id_product: product._id
    }).sort({ size: 1 })

    res.json({ product, sizeProduct })
  } catch (error) {
    console.log(error)
  }
}

export const getSizeProductByIdProduct = async (req, res) => {
  try {
    const sizeProduct = await sizeProductModel.find({
      id_product: req.params.id
    })
    return res.json(sizeProduct)
  } catch (error) {
    console.log(error)
  }
}

export const getSizeProductById = async (req, res) => {
  try {
    const sizeProduct = await sizeProductModel.findOne({ _id: req.params.id })
    return res.json(sizeProduct)
  } catch (error) {
    console.log(error)
  }
}

export const getProductsByCategory = async (req, res) => {
  try {

    const category = await Categories.findOne({ slug: req.params.category })

    if (!category) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan' })
    }

    const products = await Product.find({ id_category: category._id }).populate('id_category')

    res.json(products)
  } catch (error) {
    console.log(error)
  }
}

export const searchProducts = async (req, res) => {
  try {
    const searchQuery = req.query.q.toLowerCase(); // Ambil query pencarian dan ubah ke huruf kecil

    // Pisahkan kata-kata dari query pencarian
    const searchKeywords = searchQuery.split(' ');

    // Buat array regex untuk setiap kata
    const regexQueries = searchKeywords.map(keyword => new RegExp(keyword, 'i'));

    // Lakukan pencarian berdasarkan judul, kategori, dan subkategori
    const products = await Product.find({
      $or: [
        // { title: { $in: regexQueries } },
        { 'id_category.title': { $in: regexQueries } },
        // { 'id_sub_category.title': { $in: regexQueries } },
      ],
    }).populate('id_category');

    console.log(products)

    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Terjadi kesalahan server'
    });
  }
}

// POST Add Product
export const AddProduct = async (req, res) => {
  // cek files
  if (req.files == null) return res.status(400).json({
    msg: 'Tidak ada file yang diupload!'
  })

  // get request body
  const title = req.body.title
  const slug = req.body.slug
  const description = req.body.description
  const category = req.body.category
  let subCategory = req.body.subCategoryId
  const price = req.body.price
  const file = req.files?.file
  const fileSize = file?.data?.length
  const ext = path.extname(file.name)
  const fileName = file.md5 + ext
  const url = `${req.protocol}://${req.get('host')}/images/${fileName}`
  const allowType = ['.png', '.jpg', '.jpeg']

  // cek type file
  if (!allowType.includes(ext.toLowerCase())) return res.status(422).json({
    msg: 'Yang anda upload bukan gambar!'
  })
  // cek size file
  if (fileSize > 6000000) return res.status(422).json({
    msg: 'Ukuran gambar tidak boleh lebih dari 5 MB'
  })

  // cek duplicate title 
  const duplicateTitle = await Product.findOne({
    title: { $regex: new RegExp('^' + title + '$', 'i') }
  })
  if (duplicateTitle) return res.status(400).json({
    status: false, msg: 'Title sudah digunakan!', error: 'title'
  })

  // cek duplicate slug
  const duplicateSlug = await Product.findOne({ slug })
  if (duplicateSlug) return res.status(400).json({
    status: false, msg: 'Slug sudah digunakan!', error: 'slug'
  })

  // save file image and save product to database
  file.mv(`./public/images/${fileName}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message })
    try {
      await new Product({
        title, slug, description, id_category: category, id_sub_category: subCategory, price, image: fileName, url
      }).save()

      res.status(201).json({
        msg: 'Produk berhasil ditambahkan!', status: true
      })
    } catch (error) {
      console.log(error.message)
    }
  })
}

// PUT Edit Product
export const editProduct = async (req, res) => {
  try {

    // find product by id
    const product = await Product.findById(req.params.id)
    // get request body
    const { title, oldTitle, slug, oldSlug, description, price, category, subCategoryId } = req.body

    // cek duplicate title
    const duplicateTitle = await Product.findOne({
      title: { $regex: new RegExp('^' + title + '$', 'i') }
    })
    if (duplicateTitle && title.toLowerCase() !== oldTitle.toLowerCase()) {
      return res.status(400).json({
        status: false, msg: 'Title sudah digunakan!', error: 'title'
      })
    }

    // cek duplicate slug
    const duplicateSlug = await Product.findOne({ slug })
    if (duplicateSlug && slug.toLowerCase() !== oldSlug.toLowerCase()) {
      return res.status(400).json({
        status: false, msg: 'Slug sudah digunakan!', error: 'slug'
      })
    }

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
      if (!allowType.includes(ext.toLowerCase())) return res.status(422).json({
        msg: 'Yang anda inputkan bukan Gambar!! (png, jpg, jpeg)'
      })
      // // Validation File Size
      if (filesize > 6000000) return res.status(422).json({
        msg: 'Gambar tidak boleh dari 6 MB'
      })

      // update image
      const filePath = `./public/images/${product.image}`
      unlink(filePath, (err) => {
        if (err) return console.log(err)
      })

      file.mv(`./public/images/${fileName}`, (err) => { if (err) return res.status(500).json({ msg: err.message }) })
    }

    const url = `${req.protocol}://${req.get('host')}/images/${fileName}`
    await Product.updateOne({ _id: req.params.id }, {
      $set: {
        title, slug, description, price, id_category: category, id_sub_category: subCategoryId, url, image: fileName
      }
    })

    res.status(200).json({
      msg: 'Produk berhasil diubah!'
    })

  } catch (error) {
    console.log(error)
  }
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
  } catch (error) {
    console.log(error)
  }
}

// ADD SIZE PRODUCT
export const addSizeProduct = async (req, res) => {
  try {
    const { addSize, idProduct, addStock } = req.body

    const duplicate = await sizeProductModel.findOne({ id_product: idProduct, size: addSize })
    if (duplicate) return res.status(400).json({ msg: 'size sudah ada!' })

    await new sizeProductModel({
      size: addSize, id_product: idProduct, stock: addStock
    }).save()
    return res.status(200).json({
      msg: 'ukuran dan stok berhasil ditambahkan'
    })
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
      const carts = await Cart.find({ userId: decoded.userId }).populate('productId')
      res.json(carts)
    } catch (error) {
      console.log(error.response)
    }
  })
}

// Delete cart by id
export const deleteCartById = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.status(401)
    await Cart.findByIdAndDelete(req.params.id)
    return res.status(200).json({
      status: true, msg: 'Cart berhasil di hapus!'
    })
  } catch (error) {
    console.log(error)
  }
}