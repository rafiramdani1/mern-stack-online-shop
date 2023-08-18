import Categories from "../../models/category.mode.js";
import SubCategories from "../../models/subCategory.js";
import mongoose from "mongoose";

// GET Category All
export const getCategoriesAll = async (req, res) => {
  try {
    const categories = await Categories.find()
    return res.json(categories)
  } catch (error) { console.log(error) }
}

// GET Category By ID
export const getCategoriesById = async (req, res) => {
  try {
    const categoryId = await Categories.findById(req.params.id)
    if (!categoryId) return res.status(404)
    return res.json(categoryId)
  } catch (error) { return res.status(404).json({ msg: error.message }) }
}

// POST Add Category
export const addCategory = async (req, res) => {
  try {
    const { title, slug } = req.body

    const categories = await Categories.find({})

    let TitleMatchFound = false
    let SlugMatchFound = false
    for (let i = 0; i < categories.length; i++) {
      const titleDb = categories[i].title.toLowerCase()
      const slugDb = categories[i].slug
      if (title.toLowerCase() === titleDb) {
        TitleMatchFound = true
        break
      }
      if (slug === slugDb) {
        SlugMatchFound = true
        break
      }
    }

    if (TitleMatchFound) return res.status(400).json({ msg: 'Title sudah digunakan!' })
    if (SlugMatchFound) return res.status(400).json({ msg: 'Slug sudah digunakan!' })

    await new Categories({ title, slug }).save()
    return res.status(200).json({ msg: 'Kategori berhasil ditambahkan!', status: true })
  } catch (error) { console.log(error.message) }
}

// PUT Edit Category
export const editCategory = async (req, res) => {
  try {
    const { title, slug, oldTitle, oldSlug } = req.body

    const categories = await Categories.find({})
    let titleMatch = false
    let slugMatch = false

    for (let i = 0; i < categories.length; i++) {
      const titleDb = categories[i].title.toLowerCase()
      const slugDb = categories[i].slug

      if (titleDb === title.toLowerCase() && titleDb !== oldTitle.toLowerCase()) {
        titleMatch = true
        break
      }
      if (slugDb === slug && slugDb !== oldSlug) {
        slugMatch = true
        break
      }
    }

    if (titleMatch) return res.status(400).json({ msg: 'Title sudah digunakan!' })
    if (slugMatch) return res.status(400).json({ msg: 'Slug sudah digunakan!' })

    await Categories.updateOne({ _id: req.params.id }, { $set: { title, slug } })
    return res.status(200).json({ msg: 'Kategori berhasil diupdate!' })

  } catch (error) { console.log(error) }
}

// DELETE Category By ID
export const DeleteCategory = async (req, res) => {
  try {
    await Categories.findByIdAndDelete({ _id: req.params.id })
    await SubCategories.deleteMany({ id_category: req.params.id })
    return res.status(200).json({ msg: 'Kategori berserta sub-kategorinya berhasil dihapus!', status: true })
  } catch (error) { console.log(error) }
}