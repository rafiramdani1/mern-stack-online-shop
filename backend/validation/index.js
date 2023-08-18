import { validationResult, check, body } from 'express-validator'

// Errors validator
export const validation = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) { return res.status(400).json({ status: false, msg: errors.array()[0].msg }) }
  next()
}

// Register Validation
export const RegisterValidation = [
  check('username', 'Username tidak boleh kosong!').notEmpty(),
  check('email', 'Email tidak boleh kosong!').notEmpty().isEmail().withMessage('Email not valid!'),
  check('password', 'Password tidak boleh kosong!').notEmpty().isLength({ min: 6 }).withMessage('Password must be at least 5 chars long').matches(/\d/).withMessage('Password must contain a number')
]

// Login
export const LoginValidation = [
  check('email', 'Email tidak boleh kosong!').notEmpty(), check('password', 'Password tidak boleh kosong!').notEmpty()
]

// ADMIN

// Add & Update Category
export const addAndUpdateCategory = [
  check('title', 'Title tidak boleh kosong!').notEmpty(), check('slug', 'Slug tidak boleh kosong!').notEmpty()
]

// Add Product
export const addProductValidation = [
  check('title', 'Title tidak boleh kosong!').notEmpty().isLength({ min: 4 }).withMessage('Title harus lebih dari 4 karakter!'),
  check('slug', 'Slug tidak boleh kosong!').notEmpty().isLength({ min: 4 }).withMessage('Slug harus lebih dari 4 karakter!'),
  check('category', 'Pilih kategori!!').notEmpty(),
  check('subCategoryId', 'Pilih Sub Kategori!!').notEmpty(),
  check('description', 'Deskripsi tidak boleh kosong!').notEmpty(),
  check('price', 'Harga tidak boleh kosong!').notEmpty()
]

export const addSizeProductValidation = [
  check('addSize', 'Pilih ukuran!').notEmpty(),
  check('idProduct', 'id_product tidak boleh kosong!').notEmpty(),
  check('addStock', 'Stock tidak boleh kosong!').notEmpty().isNumeric().withMessage('yang anda masukkan harus angka!')
]

export const editSizeStockProduct = [
  check('editSize', 'Size is required!').notEmpty(), check('editStock', 'Stock is required!').notEmpty()
]