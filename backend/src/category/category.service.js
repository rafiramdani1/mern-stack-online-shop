import mongoose from "mongoose"
import { categoryRepository } from "./category.repository.js"

const getAllCategories = async () => {
  const categories = await categoryRepository.findAllCategories()
  return categories
}

const getCategoryById = async (id) => {
  // cek type id
  if (!mongoose.Types.ObjectId.isValid(id)) throw Error('Category tidak ditemukan!')

  const category = await categoryRepository.findCategoryById(id)
  if (!category) throw Error('Category tidak ditemukan!')

  return category
}

const createCategory = async (newCategoryData) => {
  // cek duplicate title
  const findCategoryByTitle = await categoryRepository.findCategoryByTitle(
    { $regex: new RegExp('^' + newCategoryData.title + '$', 'i') }
  )
  if (findCategoryByTitle) throw Error('Title sudah digunakan!')

  // cek duplicate slug
  const findCategoryBySlug = await categoryRepository.findCategoryBySlug(
    { $regex: new RegExp('^' + newCategoryData.slug + '$', 'i') }
  )
  if (findCategoryBySlug) throw Error('Slug sudah digunakan!')

  const category = await categoryRepository.insertCategory(newCategoryData)
  return category
}

const editCategoryById = async (id, categoryData) => {
  // cek type id
  await getCategoryById(id)

  // cek duplicate title
  const findCategoryByTitle = await categoryRepository.findCategoryByTitle({
    $regex: new RegExp('^' + categoryData.title + '$', 'i')
  })
  if (findCategoryByTitle &&
    (categoryData.title).toLowerCase() !== (categoryData.oldTitle).toLowerCase())
    throw Error('Title sudah digunakan!')

  // cek duplicate slug
  const findCategoryBySlug = await categoryRepository.findCategoryBySlug({
    $regex: new RegExp('^' + categoryData.slug + '$', 'i')
  })
  if (findCategoryBySlug && categoryData.slug !== categoryData.oldSlug)
    throw Error('Slug sudah digunakan!')

  const category = await categoryRepository.editCategory(id, categoryData)
  return category
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