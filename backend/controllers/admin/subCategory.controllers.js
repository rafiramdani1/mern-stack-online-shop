import SubCategories from "../../models/subCategory.js";

// add sub category
export const addSubCategory = async (req, res) => {
  try {
    const { title, slug, categoryId } = req.body
    if (title === '') return res.status(400).json({ msg: 'Title tidak boleh kosong!' })
    if (slug === '') return res.status(400).json({ msg: 'Slug tidak boleh kosong!' })
    if (categoryId === '' || categoryId === 'Pilih Kategori') return res.status(400).json({ msg: 'Pilih Kategori!' })

    const subCategories = await SubCategories.find({})
    let TitleMatchFound = false
    let slugMatchFound = false
    for (let i = 0; i < subCategories.length; i++) {
      const titleDb = subCategories[i].title.toLowerCase()
      const slugDb = subCategories[i].slug
      if (titleDb === title.toLowerCase()) {
        TitleMatchFound = true
        break
      }
      if (slugDb === slug) {
        slugMatchFound = true
        break
      }
    }
    if (TitleMatchFound) return res.status(400).json({ msg: 'Title sudah digunakan!' })
    if (slugMatchFound) return res.status(400).json({ msg: 'Slug sudah digunakan!' })

    await new SubCategories({ title, slug, id_category: categoryId }).save()
    return res.status(200).json({ msg: 'Sub kategori berhasil ditambahkan' })
  } catch (error) {
    console.log(error)
  }
}

export const editSubCategory = async (req, res) => {
  try {
    const { subCategory, oldSubCategory, slug, oldSlug, categoryId } = req.body
    if (subCategory === '') return res.status(400).json({ msg: 'Sub Kategori tidak boleh kosong!' })
    if (slug === '') return res.status(400).json({ msg: 'Slug tidak boleh kosong!' })
    if (categoryId === '') return res.status(400).json({ msg: 'Pilih Kategori!' })

    const subCategories = await SubCategories.find({})
    let subCategoryMatch = false
    let slugMatch = false

    for (let i = 0; i < subCategories.length; i++) {
      const subCategoryDb = subCategories[i].title.toLowerCase()
      const slugDb = subCategories[i].slug

      if (subCategoryDb === subCategory.toLowerCase() && subCategoryDb !== oldSubCategory.toLowerCase()) {
        subCategoryMatch = true
        break
      }
      if (slugDb === slug.toLowerCase() && slugDb !== oldSlug.toLowerCase()) {
        slugMatch = true
      }
    }

    if (subCategoryMatch) return res.status(400).json({ msg: 'Sub Kategori sudah ada!' })
    if (slugMatch) return res.status(400).json({ msg: 'Slug sudah ada!' })

    await SubCategories.updateOne({ _id: req.params.id }, { $set: { title: subCategory, slug, id_category: categoryId } })

    return res.status(200).json({ msg: 'Sub kategori berhasil diubah!' })
  } catch (error) {
    console.log(error)
  }
}

export const deleteSubCategory = async (req, res) => {
  try {
    await SubCategories.findByIdAndDelete(req.params.id)
    return res.status(200).json({ msg: 'Sub kategori berhasil dihapus!' })
  } catch (error) {
    console.log(error)
  }
}

// GET subcategories All
export const getSubCategory = async (req, res) => {
  try {
    const subCategories = await SubCategories.find({}).populate('id_category', 'title')
    res.json(subCategories)
  } catch (error) {
    console.log(error)
  }
}

export const getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategories.findById(req.params.id).populate('id_category', 'title')
    res.json(subCategory)
  } catch (error) {
    console.log(error)
  }
}

export const getSubCategoryByCategoryId = async (req, res) => {
  try {
    const subCategories = await SubCategories.find({ id_category: req.params.id })
    res.json(subCategories)
  } catch (error) {
    console.log(err)
  }
}