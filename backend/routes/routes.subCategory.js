import express from 'express'
import { getSubCategory, addSubCategory, deleteSubCategory, editSubCategory, getSubCategoryByCategoryId, getSubCategoryById } from '../controllers/admin/subCategory.controllers.js'

const routerSubCategory = express.Router()

routerSubCategory.get('/', getSubCategory)
routerSubCategory.get('/:id', getSubCategoryById)
routerSubCategory.get('/sub-category-id/:id', getSubCategoryByCategoryId)
routerSubCategory.post('/addSubCategory', addSubCategory)
routerSubCategory.put('/editSubCategory/:id', editSubCategory)
routerSubCategory.delete('/delete/:id', deleteSubCategory)


export default routerSubCategory
