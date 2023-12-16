import { categoryService } from "./category.service.js"

const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories()
    res.status(200).json(categories)
  } catch (error) {
    res.status(400).json({
      msg: error.message
    })
  }
}

const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id
    const category = await categoryService.getCategoryById(categoryId)
    res.status(200).json(category)
  } catch (error) {
    res.status(400).json({
      msg: error.message
    })
  }
}

const addCategory = async (req, res) => {
  try {
    const newCategoryData = req.body

    const category = await categoryService.createCategory(newCategoryData)
    res.status(201).json({
      msg: 'Kategori berhasil ditambahkan!',
      data: category,
      status: true
    })
  } catch (error) {
    res.status(400).json({
      msg: error.message
    })
  }
}

const editCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id
    const categoryData = req.body

    const category = await categoryService.editCategoryById(categoryId, categoryData)
    res.status(201).json({
      status: true,
      msg: 'Kategori berhasil diupdate!',
      data: category
    })
  } catch (error) {
    res.status(400).json({
      msg: error.message
    })
  }
}

const deleteCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id
    await categoryService.deleteCategory(categoryId)

    res.status(200).json({
      msg: 'Kategori beserta sub kategorinya berhasil dihapus!',
      status: true
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      msg: error.message
    })
  }
}

export const categoryController = {
  getCategories,
  getCategoryById,
  addCategory,
  editCategoryById,
  deleteCategoryById,
}