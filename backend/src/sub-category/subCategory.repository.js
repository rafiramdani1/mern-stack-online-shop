import SubCategories from "../../models/subCategory.js"

const findAllSubCategories = async () => {
  const subCategories = await SubCategories.find({}).populate('id_category', 'title')
  return subCategories
}

const findSubCategoryById = async (id) => {
  const subCategory = await SubCategories.findById(id).populate('id_category', 'title')
  return subCategory
}

const findSubCategoryByTitle = async (title) => {
  const subCategory = await SubCategories.findOne({ title })
  return subCategory
}

const findSubCategoryBySlug = async (slug) => {
  const subCategory = await SubCategories.findOne({ slug })
  return subCategory
}

const findSubCategoriesByCategoryId = async (id) => {
  const subCategory = await SubCategories.find({ id_category: id })
  return subCategory
}

const insertSubCategory = async (newSubCategory) => {
  const subCategory = await new SubCategories({
    title: newSubCategory.title,
    slug: newSubCategory.slug,
    id_category: newSubCategory.categoryId
  }).save()
  return subCategory
}

const updateSubCategory = async (id, subCategoryData) => {
  const subCategory = await SubCategories.updateOne({ _id: id }, {
    $set: {
      title: subCategoryData.title,
      slug: subCategoryData.slug,
      id_category: subCategoryData.categoryId
    }
  })
  return subCategory
}

const deleteSubCategory = async (id) => {
  await SubCategories.findByIdAndDelete(id)
}

export const subCategoryRepository = {
  findAllSubCategories,
  findSubCategoryById,
  findSubCategoryByTitle,
  findSubCategoryBySlug,
  findSubCategoriesByCategoryId,
  insertSubCategory,
  updateSubCategory,
  deleteSubCategory,
}