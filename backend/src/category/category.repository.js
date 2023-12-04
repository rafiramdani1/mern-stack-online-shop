import Categories from "../../models/category.mode.js"
import SubCategories from "../../models/subCategory.js"

// find all categories
const findAllCategories = async () => {
  const categories = await Categories.find()
  return categories
}

// find category by id
const findCategoryById = async (id) => {
  const category = await Categories.findById(id)
  return category
}

// find category by title
const findCategoryByTitle = async (categoryTitle) => {
  const category = await Categories.findOne({ title: categoryTitle })
  return category
}

// find category by slug
const findCategoryBySlug = async (categorySlug) => {
  const category = await Categories.findOne({ slug: categorySlug })
  return category
}

// insert new category
const insertCategory = async (newCategory) => {
  const category = await new Categories({
    title: newCategory.title,
    slug: newCategory.slug
  }).save()
  return category
}

// edit category
const editCategory = async (id, categoryData) => {
  const category = await Categories.updateOne(
    { _id: id }, {
    $set: {
      title: categoryData.title,
      slug: categoryData.slug
    }
  })
  return category
}

// delete category
const deleteCategoryById = async (id) => {
  await Categories.deleteOne({ _id: id })
  await SubCategories.deleteMany({ id_category: id })
}

export const categoryRepository = {
  findAllCategories,
  findCategoryByTitle,
  findCategoryById,
  findCategoryBySlug,
  insertCategory,
  editCategory,
  deleteCategoryById,
} 