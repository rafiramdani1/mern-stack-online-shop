import { subCategoryService } from "./subCategory.service.js"

const getSubCategories = async (req, res) => {
  try {
    const subCategories = await subCategoryService.getAllSubCategories()
    res.json(subCategories)
  } catch (error) {
    res.status(400).send(error)
  }
}

const getSubCategoryById = async (req, res) => {
  try {
    const subCategoryId = req.params.id
    const subCategory = await subCategoryService.getSubCategoryById(subCategoryId)
    res.status(200).json(subCategory)
  } catch (error) {
    res.status(400).json({
      status: false,
      msg: error.message
    })
  }
}

const getSubCategoriesByCategoryId = async (req, res) => {
  try {
    const categoryId = req.params.id
    const subCategories = await subCategoryService.getSubCategoriesByCategoryId(categoryId)
    res.status(200).json(subCategories)
  } catch (error) {
    res.status(400).json({
      status: false,
      msg: error.message
    })
  }
}

const addSubCategory = async (req, res) => {
  try {
    const newSubCategory = req.body
    await subCategoryService.createSubCategory(newSubCategory)

    res.status(201).json({
      status: true,
      msg: 'Sub kategori berhasil ditambahkan'
    })
  } catch (error) {
    res.status(400).json({
      msg: error.message
    })
  }
}

const editSubCategoryById = async (req, res) => {
  try {
    const subCategoryId = req.params.id
    const subCategoryData = req.body

    await subCategoryService.editSubCategoryById(subCategoryId, subCategoryData)
    res.status(201).json({
      status: true,
      msg: 'Sub kategori berhasil diubah!',
    })
  } catch (error) {
    res.status(400).json({
      status: false,
      msg: error.message
    })
  }
}

const deleteSubCategoryById = async (req, res) => {
  try {
    const subCategoryId = req.params.id
    await subCategoryService.deleteSubCategoryById(subCategoryId)

    res.status(200).json({
      status: true,
      msg: 'Sub kategory berhasil dihapus!'
    })
  } catch (error) {
    res.status(400).json({
      status: false,
      msg: error.message
    })
  }
}

export const subCategoryController = {
  getSubCategories,
  getSubCategoryById,
  getSubCategoriesByCategoryId,
  addSubCategory,
  editSubCategoryById,
  deleteSubCategoryById,
}