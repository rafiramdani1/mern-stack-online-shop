import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import AlertErrors from '../../layouts/AlertErrors'
import LoadingSpinner from '../../layouts/Loading'
import ModalSuccess from '../../layouts/ModalSuccess'
import { ProductsContext } from './ProductsContext'
import { CategoriesContext } from '../categories/CategoriesContext'
import { SubCategoriesContext } from '../sub-categories/SubCategoriesContext'
import slugify from 'slugify'

const EditProduct = () => {

  const { getProductById, editProduct, msgErrors, msgSuccess, clearError } = useContext(ProductsContext)
  const { getCategories, categories } = useContext(CategoriesContext)
  const { getSubCategoryByCategoryId } = useContext(SubCategoriesContext)

  const location = useLocation()
  const idProductParam = new URLSearchParams(location.search).get('id')
  const idSubCateParam = new URLSearchParams(location.search).get('subcate')

  const [title, setTitle] = useState('')
  const [oldTitle, setOldTitle] = useState('')
  const [category, setCategory] = useState('')
  const [subCategoryId, setSubCategoryId] = useState('')
  const [description, setDescription] = useState('')
  const [slug, setSlug] = useState('')
  const [oldSlug, setOldSlug] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
  const [imgPreview, setImgPreview] = useState('')
  const [loadingSpinner, setLoadingSpinner] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [subCategories, setSubCategories] = useState([])
  const [showSubCategories, setShowSubCategories] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const response = await getProductById(idProductParam)
        setTitle(response.product.title)
        setOldTitle(response.product.title)
        setSlug(response.product.slug)
        setOldSlug(response.product.slug)
        setCategory(response.product.id_category._id)
        setSubCategoryId(response.product.id_sub_category._id)
        setDescription(response.product.description)
        setPrice(response.product.price)
        setImage(response.product.image)
        setImgPreview(response.product.url)
      } catch (error) {
        console.log(error)
      }
    }

    const fetchSubCategoryByIdCategory = async () => {
      try {
        const response = await getSubCategoryByCategoryId(idSubCateParam)
        setSubCategories(response)
      } catch (error) {
        console.log(error)
      }
    }

    fetchProductById()
    getCategories()
    fetchSubCategoryByIdCategory()
  }, [])

  const handleTitleChange = e => {
    const value = e.target.value
    setTitle(value)
    const newSlug = slugify(value, { lower: true })
    setSlug(newSlug)
    clearError()
  }

  const handleSlugChange = e => {
    const value = e.target.value
    const newSlug = slugify(value, { lower: true })
    setSlug(newSlug)
    clearError()
  }

  const handleDescriptionChange = (e, editor) => {
    setDescription(editor.getData())
    clearError()
  }

  const handleCategoryChange = async e => {
    const value = e.target.value
    if (value === '') {
      setShowSubCategories(false)
      setSubCategoryId('')
    } else {
      setShowSubCategories(true)
      try {
        const response = await getSubCategoryByCategoryId(value)
        setSubCategories(response)
      } catch (error) {
        console.log(error)
      }
    }
    setCategory(value)
  }

  const handleChangeSubCategory = async e => {
    const value = e.target.value
    setSubCategoryId(value)
  }

  const handlePriceChange = e => {
    const value = e.target.value
    setPrice(value)
    clearError()
  }

  const handleImageChange = e => {
    const value = e.target.files[0]
    setImage(value)
    setImgPreview(URL.createObjectURL(value))
    clearError()
  }

  const handleEditProduct = async (e) => {
    e.preventDefault()
    setLoadingSpinner(true)
    try {
      const data = { title, oldTitle, slug, oldSlug, description, price, category, subCategoryId, image }
      await editProduct(idProductParam, data)
      setModalSuccess(true)
      setTimeout(() => navigate('/admin/dashboard/products'), 2000)
    } catch (error) {
      if (error.response) {
        return
      }
    } finally {
      setLoadingSpinner(false)
    }
  }

  return (
    <>
      {loadingSpinner ? <LoadingSpinner /> : null}
      {modalSuccess ? <ModalSuccess msg={msgSuccess} close={() => setModalSuccess(false)} /> : null}
      <section className='p-4 sm:ml-64 mt-20'>
        <div className="flex flex-col items-center justify-center px-6 py-8">
          <div className="w-full bg-white rounded-lg shadow">
            <div className="p-6 space-y-4">
              <h1 className="text-xl font-semibold leading-tight tracking-tight text-slate-800">
                Edit Product
              </h1>
              <form onSubmit={handleEditProduct} className="space-y-4 md:space-y-6">

                {msgErrors && (<AlertErrors msg={msgErrors} close={clearError} />)}

                <div className='flex'>
                  <div className='w-1/2 mr-3'>
                    <div>
                      <label className="block mb-2 text-textSecondary text-sm font-medium">Title</label>
                      <input type="title" name="title" id="title"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        placeholder="Title" value={title} onChange={handleTitleChange} />
                      <input type='hidden' value={oldTitle} readOnly />
                    </div>
                  </div>
                  <div className='w-1/2 mr-3'>
                    <div>
                      <label className="block mb-2 text-textSecondary text-sm font-medium">Slug</label>
                      <input type="slug" name="slug" id="slug"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        placeholder="Slug" value={slug} onChange={handleSlugChange} />
                      <input type='hidden' value={oldSlug} readOnly />
                    </div>
                  </div>

                </div>
                <div className='flex'>
                  <div className='mr-3'>
                    <div className='relative'>
                      <label className="block mb-2 text-textSecondary text-sm font-medium">Kategori</label>
                      <select className='block appearance-none w-40 bg-gray-50 border border-gray-300 text-gray-900 py-2 px-4 pr-8leading-tight focus:outline-none rounded-lg focus:bg-white focus:border-gray-500' value={category} onChange={handleCategoryChange}>
                        <option value=''>Select</option>
                        {categories.map(cate => (
                          <option key={cate._id} value={cate._id}>{cate.title}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 flex items-center px-2 text-gray-700 left-32 mt-7">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                      </div>
                    </div>
                  </div>
                  {showSubCategories ?
                    <div className='mr-3'>
                      <div className='relative'>
                        <label className="block mb-2 text-textSecondary text-sm font-medium">Sub Kategori</label>
                        <select className='block appearance-none w-40 bg-gray-50 border border-gray-300 text-gray-900 py-2 px-4 pr-8leading-tight focus:outline-none rounded-lg focus:bg-white focus:border-gray-500' value={subCategoryId} onChange={handleChangeSubCategory}>
                          <option>Select</option>
                          {subCategories.map(cate => (
                            <option key={cate._id} value={cate._id}>{cate.title}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 flex items-center px-2 text-gray-700 left-32 mt-7">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                      </div>
                    </div>
                    : null
                  }

                </div>

                <div className='block'>
                  <label
                    className="block mb-2 text-textSecondary text-sm font-medium">Description</label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={description}
                    onChange={handleDescriptionChange}
                  />
                </div>

                <div className='flex'>
                  <div className='w-1/3 mr-3'>
                    <div>
                      <label className="block mb-2 text-textSecondary text-sm font-medium">Price</label>
                      <input type="price" name="price" id="price"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        placeholder="2.500.000" value={price} onChange={handlePriceChange} />
                    </div>
                  </div>
                </div>
                <div className='flex'>
                  <div className='w-1/3'>
                    <label className="block mb-2 text-textSecondary text-sm font-medium">Image</label>
                    <input type='file' onChange={handleImageChange} />
                  </div>
                  <div className='w-1/3'>
                    {imgPreview ? (
                      <div>
                        <img src={imgPreview} alt='Preview' className='w-48 h-40' />
                      </div>
                    ) : ('')}
                  </div>
                </div>
                <button type="submit"
                  className="w-1/3 bg-cyan-500 text-white hover:bg-cyan-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Edit</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default EditProduct
