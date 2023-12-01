import Categories from "../../models/category.mode.js";
import SubCategories from "../../models/subCategory.js";

// GET Category All
export const getCategoriesAll = async (req, res) => {
  try {
    // find all data in database
    const categories = await Categories.find()
    return res.json(categories)
  } catch (error) {
    console.log(error)
  }
}

// GET Category By ID
export const getCategoriesById = async (req, res) => {
  try {
    // find data by id in database
    const categoryId = await Categories.findById(req.params.id)
    // cek id category
    if (!categoryId) return res.status(404)
    return res.json(categoryId)
  } catch (error) {
    return res.status(404).json({
      msg: error.message
    })
  }
}

// POST Add Category
export const addCategory = async (req, res) => {
  try {
    // get request bodt
    const { title, slug } = req.body

    // cek duplicate title 
    const duplicateTitle = await Categories.findOne({
      title: { $regex: new RegExp('^' + title + '$', 'i') }
    })
    if (duplicateTitle) return res.status(400).json({
      status: false, msg: 'Title sudah digunakan!', error: 'title'
    })

    // cek duplicate slug
    const duplicateSlug = await Categories.findOne({ slug })
    if (duplicateSlug) return res.status(400).json({
      status: false, msg: 'Slug sudah digunakan!', error: 'slug'
    })

    // save to db
    const category = await new Categories({ title, slug }).save()
    return res.status(200).json({
      msg: 'Kategori berhasil ditambahkan!',
      data: category,
      status: true
    })
  } catch (error) {
    console.log(error.message)
  }
}

// PUT Edit Category
export const editCategory = async (req, res) => {
  try {
    // get request body
    const { title, slug, oldTitle, oldSlug } = req.body

    // cek duplicate title
    const duplicateTitle = await Categories.findOne({
      title: { $regex: new RegExp('^' + title + '$', 'i') }
    })
    if (duplicateTitle && title.toLowerCase() !== oldTitle.toLowerCase()) return res.status(400).json({
      status: false, msg: 'Title sudah digunakan!', error: 'title'
    })

    // cek duplicate slug
    const duplicateSlug = await Categories.findOne({ slug })
    if (duplicateSlug && slug !== oldSlug) return res.status(400).json({
      status: false, msg: 'Slug sudah digunakan!', error: 'slug'
    })

    const data = await Categories.updateOne({ _id: req.params.id }, {
      $set: { title, slug }
    })
    return res.status(200).json({
      status: true, msg: 'Kategori berhasil diupdate!', data
    })
  } catch (error) {
    console.log(error)
  }
}

// DELETE Category By ID
export const DeleteCategory = async (req, res) => {
  try {
    // find one data in database
    const category = await Categories.findOne({ _id: req.params.id })
    // cek category id
    if (!category) return res.sendStatus(400)

    // find and delete
    await Categories.deleteOne({ _id: req.params.id })
    await SubCategories.deleteMany({ id_category: req.params.id })

    return res.status(200).json({
      msg: 'Kategori berserta sub-kategorinya berhasil dihapus!', status: true
    })
  } catch (error) {
    console.log(error)
  }
} 