import SubCategories from "../../models/subCategory.js";

// add sub category
export const addSubCategory = async (req, res) => {
  try {
    // get request body
    const { title, slug, categoryId } = req.body

    // cek req body
    if (title === '') return res.status(400).json({
      msg: 'Title tidak boleh kosong!'
    })
    if (slug === '') return res.status(400).json({
      msg: 'Slug tidak boleh kosong!'
    })
    if (categoryId === '' || categoryId === 'Pilih Kategori') return res.status(400).json({ msg: 'Pilih Kategori!' })

    // cek duplicate title
    const duplicateTitle = await SubCategories.findOne({ title: { $regex: new RegExp('^' + title + '$', 'i') } })
    if (duplicateTitle) return res.status(400).json({
      status: false, msg: 'Title sudah digunakan!', error: 'title'
    })

    // cek duplicate slug
    const duplicateSlug = await SubCategories.findOne({ slug })
    if (duplicateSlug) return res.status(400).json({
      status: false, msg: 'Slug sudah digunakan!', error: 'slug'
    })

    // add new sub categories to database
    await new SubCategories({
      title, slug, id_category: categoryId
    }).save()

    // return response
    return res.status(200).json({
      msg: 'Sub kategori berhasil ditambahkan', status: true
    })
  } catch (error) {
    console.log(error)
  }
}

export const editSubCategory = async (req, res) => {
  try {
    // get request body
    const { subCategory, oldSubCategory, slug, oldSlug, categoryId } = req.body

    // cek request body
    if (subCategory === '') return res.status(400).json({
      msg: 'Sub Kategori tidak boleh kosong!'
    })
    if (slug === '') return res.status(400).json({
      msg: 'Slug tidak boleh kosong!'
    })
    if (categoryId === '') return res.status(400).json({
      msg: 'Pilih Kategori!'
    })

    // cek duplicate title
    const duplicateTitle = await SubCategories.findOne({
      title: { $regex: new RegExp('^' + subCategory + '$', 'i') }
    })
    if (duplicateTitle && subCategory.toLowerCase() !== oldSubCategory.toLowerCase()) return res.status(400).json({
      status: false, msg: 'Title sudah digunakan!', error: 'title'
    })

    // cek duplicate slug
    const duplicateSlug = await SubCategories.findOne({ slug })
    if (duplicateSlug && slug !== oldSlug) return res.status(400).json({
      status: false, msg: 'Slug sudah digunakan!', error: 'slug'
    })

    // update sub categories and save to database
    await SubCategories.updateOne({ _id: req.params.id }, {
      $set: { title: subCategory, slug, id_category: categoryId }
    })

    // return response
    return res.status(200).json({
      msg: 'Sub kategori berhasil diubah!'
    })
  } catch (error) {
    console.log(error)
  }
}

export const deleteSubCategory = async (req, res) => {
  try {
    // find and delete data
    await SubCategories.findByIdAndDelete(req.params.id)
    // return response
    return res.status(200).json({ msg: 'Sub kategori berhasil dihapus!', status: true })
  } catch (error) {
    console.log(error)
  }
}

// GET subcategories All
export const getSubCategory = async (req, res) => {
  try {
    // find all and populate data in database
    const subCategories = await SubCategories.find({}).populate('id_category', 'title')
    // return response
    res.json(subCategories)
  } catch (error) {
    console.log(error)
  }
}

export const getSubCategoryById = async (req, res) => {
  try {
    // find by id and populate data in database
    const subCategory = await SubCategories.findById(req.params.id).populate('id_category', 'title')
    // return response
    res.json(subCategory)
  } catch (error) {
    console.log(error)
  }
}

export const getSubCategoryByCategoryId = async (req, res) => {
  try {
    // find all data in database
    const subCategories = await SubCategories.find({ id_category: req.params.id })
    // return response
    res.json(subCategories)
  } catch (error) {
    console.log(err)
  }
}