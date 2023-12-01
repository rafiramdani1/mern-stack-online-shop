import express from 'express'
import { getCategoriesAll, getCategoriesById, addCategory, editCategory, DeleteCategory } from '../controllers/admin/categories.controllers.js'
import { validation, addAndUpdateCategory } from '../validation/index.js'
import { verifyTokenAccess, verifyTokenAccessAdmin } from '../middleware/middleware.js'

const routerCategories = express.Router()

// GET Category All
routerCategories.get('/', getCategoriesAll)

// GET Category By ID
routerCategories.get('/:id', getCategoriesById)

// add categoies
routerCategories.post('/', addAndUpdateCategory, validation, addCategory)

// Edit Category
routerCategories.put('/:id', addAndUpdateCategory, validation, editCategory)

// Delete Category
routerCategories.delete('/:id', verifyTokenAccessAdmin, DeleteCategory)

export default routerCategories