import express from 'express'
import { categoryController } from './category.controller.js'
import { addAndUpdateCategory, validation } from '../../validation/index.js'

export const categoryRouter = express.Router()

categoryRouter.get('/', categoryController.getCategories)
categoryRouter.get('/:id', categoryController.getCategoryById)
categoryRouter.post('/', addAndUpdateCategory, validation, categoryController.addCategory)
categoryRouter.put('/:id', addAndUpdateCategory, validation, categoryController.editCategoryById)
categoryRouter.delete('/:id', categoryController.deleteCategoryById)