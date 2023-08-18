import express from 'express'
import { getCategoriesAll, getCategoriesById, addCategory, editCategory, DeleteCategory } from '../controllers/admin/categories.controllers.js'
import { validation, addAndUpdateCategory } from '../validation/index.js'

const routerCategories = express.Router()

// GET Category All
routerCategories.get('/', getCategoriesAll)

// GET Category By ID
routerCategories.get('/:id', getCategoriesById)

// add categoies
routerCategories.post('/add-categories', addAndUpdateCategory, validation, addCategory)

// Edit Category
routerCategories.put('/edit-categories/:id', addAndUpdateCategory, validation, editCategory)

// Delete Category
routerCategories.delete('/delete/:id', DeleteCategory)

export default routerCategories