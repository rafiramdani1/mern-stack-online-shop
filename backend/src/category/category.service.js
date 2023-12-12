import { categoryRepository } from "./category.repository.js"

const getAllCategories = async () => {
  const categories = await categoryRepository.findAllCategories()
  return categories
}

const getCategoryById = async (id) => {
  const category = await categoryRepository.findCategoryById(id)
  if (!category) throw Error('Category tidak ditemukan!')
  return category
}

const createCategory = async (newCategoryData) => {
  try {
    // cek duplicate title
    const findCategoryByTitle = await categoryRepository.findCategoryByTitle(
      { $regex: new RegExp('^' + newCategoryData.title + '$', 'i') }
    )
    if (findCategoryByTitle) {
      throw {
        status: false,
        msg: 'Title sudah digunakan!',
        errorType: 'title'
      }
    }

    // cek duplicate slug
    const findCategoryBySlug = await categoryRepository.findCategoryBySlug(
      { $regex: new RegExp('^' + newCategoryData.slug + '$', 'i') }
    )
    if (findCategoryBySlug) {
      throw {
        status: false,
        msg: 'Slug sudah digunakan!',
        errorType: 'slug'
      }
    }

    const category = await categoryRepository.insertCategory(newCategoryData)
    return category
  } catch (error) {
    throw error
  }
}

const editCategoryById = async (id, categoryData) => {
  try {
    // cek duplicate title
    const findCategoryByTitle = await categoryRepository.findCategoryByTitle({
      $regex: new RegExp('^' + categoryData.title + '$', 'i')
    })
    if (findCategoryByTitle &&
      categoryData.title.toLowerCase() !== categoryData.oldTitle.toLowerCase()) {
      throw {
        status: false,
        msg: 'Title sudah digunakan!',
        errorType: 'title'
      }
    }

    // cek duplicate slug
    const findCategoryBySlug = await categoryRepository.findCategoryBySlug({
      $regex: new RegExp('^' + categoryData.slug + '$', 'i')
    })
    if (findCategoryBySlug && categoryData.slug !== categoryData.oldSlug) {
      throw {
        status: false,
        msg: 'Slug sudah digunakan!',
        errorType: 'slug'
      }
    }

    const category = await categoryRepository.editCategory(id, categoryData)
    return category
  } catch (error) {
    throw error
  }
}

const deleteCategory = async (id) => {
  await getCategoryById(id)
  await categoryRepository.deleteCategoryById(id)
}

export const categoryService = {
  getAllCategories,
  getCategoryById,
  createCategory,
  editCategoryById,
  deleteCategory,
}