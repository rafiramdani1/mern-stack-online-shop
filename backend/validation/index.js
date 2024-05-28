import { validationResult, check, body } from 'express-validator'

// Errors validator
export const validationResults = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) { return res.status(400).json({ status: false, msg: errors.array()[0].msg }) }
  next()
}

// Register Validation
export const RegisterValidation = [
  check('username', 'Username tidak boleh kosong!').notEmpty()
    .isLength({ min: 4 }).withMessage('panjang username minimal harus 4 karakter'),
  check('email', 'Email tidak boleh kosong!').notEmpty()
    .isEmail().withMessage('Email tidak valid!'),
  check('password', 'Password tidak boleh kosong!').notEmpty()
    .isLength({ min: 6 }).withMessage('panjang password minimal harus 6 karakter')
    .matches(/\d/).withMessage('gunakan kombinasi angka untuk password')
]

// Login
export const LoginValidation = [
  check('email', 'Email tidak boleh kosong!').notEmpty(), check('password', 'Password tidak boleh kosong!').notEmpty()
]


// Add & Update Category
export const addAndUpdateCategoryValidation = [
  check('title', 'Title tidak boleh kosong!').notEmpty(), check('slug', 'Slug tidak boleh kosong!').notEmpty()
]

// add & update subcategory
export const addSubCategoryValidation = [
  check('title', 'Title tidak boleh kosong!').notEmpty(),
  check('slug', 'Slug tidak boleh kosong!').notEmpty()
]

// Add Product
export const addProductValidation = [
  check('title', 'Title tidak boleh kosong!').notEmpty().isLength({ min: 4 }).withMessage('Title harus lebih dari 4 karakter!'),
  check('slug', 'Slug tidak boleh kosong!').notEmpty().isLength({ min: 4 }).withMessage('Slug harus lebih dari 4 karakter!'),
  check('category', 'Pilih kategori!!').notEmpty(),
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

export const updateUserForCustomer = [
  check('username', 'username is required!').notEmpty()
    .isLength({ min: 4 }).withMessage('Username must be more than 4 letters'),
  check('email', 'email is required!').notEmpty().isEmail().withMessage('email not valid!'),
  check('fullname', 'fullname is required!').notEmpty(),
  check('phone', 'phone is required!').isMobilePhone('id-ID').withMessage('Format number phone not valid!')
]