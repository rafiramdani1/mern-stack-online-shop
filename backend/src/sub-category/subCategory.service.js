import mongoose from "mongoose"
import { subCategoryRepository } from "./subCategory.repository.js"

const getAllSubCategories = async () => {
  const subCategories = await subCategoryRepository.findAllSubCategories()
  return subCategories
}

const getSubCategoryById = async (id) => {
  // cek type id
  if (!mongoose.Types.ObjectId.isValid(id)) throw Error('Sub category tidak ditemukan')

  const subCategory = await subCategoryRepository.findSubCategoryById(id)
  if (!subCategory) throw Error('Sub category tidak ditemukan')

  return subCategory
}

const getSubCategoriesByCategoryId = async (id) => {
  // cek type id
  if (!mongoose.Types.ObjectId.isValid(id)) throw Error('Sub category tidak ditemukan')

  const subCategory = await subCategoryRepository.findSubCategoriesByCategoryId(id)
  if (!subCategory) throw Error('Sub category tidak ditemukan')

  return subCategory
}

const createSubCategory = async (newSubCategory) => {

  // cek sub category
  if (newSubCategory.categoryId === '' || newSubCategory.categoryId === 'Pilih Kategori') {
    throw Error('Pilih Kategori!')
  }

  // cek duplicate title
  const findSubCategoryByTitle = await subCategoryRepository.findSubCategoryByTitle({
    $regex: new RegExp('^' + newSubCategory.title + '$', 'i')
  })
  if (findSubCategoryByTitle) {
    throw Error('Title sudah digunakan!')
  }

  // cek duplicate slug
  const findSubCategoryBySlug = await subCategoryRepository.findSubCategoryBySlug(newSubCategory.slug)
  if (findSubCategoryBySlug) {
    throw Error('Slug sudah digunakan!')
  }

  const subCategory = await subCategoryRepository.insertSubCategory(newSubCategory)

  return subCategory
}

const editSubCategoryById = async (id, subCategoryData) => {
  // cek category id
  await getSubCategoryById(id)

  // cek request
  if (subCategoryData.title === '') throw Error('Title tidak boleh kosong')
  if (subCategoryData.slug === '') throw Error('Slug tidak boleh kosong')
  if (subCategoryData.categoryId === '' || subCategoryData.categoryId === 'Pilih Kategori') throw Error('Pilih Kategori')

  // cek duplicate title
  const findSubCategoryByTitle = await subCategoryRepository.findSubCategoryByTitle({
    $regex: new RegExp('^' + subCategoryData.title + '$', 'i')
  })
  if (findSubCategoryByTitle &&
    subCategoryData.title.toLowerCase() !== subCategoryData.oldTitle.toLowerCase())
    throw Error('Title sudah digunakan!')

  // cek duplicate slug
  const findSubCategoryBySlug = await subCategoryRepository.findSubCategoryBySlug(subCategoryData.slug)
  if (findSubCategoryBySlug && subCategoryData.slug !== subCategoryData.oldSlug)
    throw Error('Slug sudah digunakan!')

  const subCategory = await subCategoryRepository.updateSubCategory(id, subCategoryData)
  return subCategory
}

const deleteSubCategoryById = async (id) => {
  await getSubCategoryById(id)
  await subCategoryRepository.deleteSubCategory(id)
}

export const subCategoryService = {
  getAllSubCategories,
  getSubCategoryById,
  getSubCategoriesByCategoryId,
  createSubCategory,
  editSubCategoryById,
  deleteSubCategoryById,
}