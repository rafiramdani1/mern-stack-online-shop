import express from 'express'
import { getSubCategory, addSubCategory, deleteSubCategory, editSubCategory, getSubCategoryByCategoryId, getSubCategoryById } from '../controllers/admin/subCategory.controllers.js'

const routerSubCategory = express.Router()

routerSubCategory.get('/', getSubCategory)
routerSubCategory.post('/', addSubCategory)
routerSubCategory.get('/:id', getSubCategoryById)
routerSubCategory.get('/category/:id', getSubCategoryByCategoryId)
routerSubCategory.put('/:id', editSubCategory)
routerSubCategory.delete('/:id', deleteSubCategory)


export default routerSubCategory
