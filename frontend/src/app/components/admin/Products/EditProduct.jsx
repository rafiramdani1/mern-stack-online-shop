import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import slugify from 'slugify'
import { useGetProductByIdQuery, useGetProductsQuery, useUpdateProductMutation } from '../../../features/products/productsApiSlice'
import { useGetCategoriesQuery } from '../../../features/categories/categoriesApiSlice'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSubCategoriesByCategoryId } from '../../../features/sub-categories/subCategoriesSlice'
import AlertErrors from '../../layouts/AlertErrors'
import LoadingSpinner from '../../layouts/LoadingSpinner'
import ModalSuccess from '../../layouts/ModalSuccess'
import { selectCurrentColumnCategories, selectCurrentFilterSearchCategories, selectCurrentLimitCategories, selectCurrentPageCategories, selectCurrentSearchKeywordCategories, selectCurrentSortDirectionCategories } from '../../../features/categories/categoriesSlice'
import { selectCurrentColumnProduct, selectCurrentFilterSearchProduct, selectCurrentLimitProduct, selectCurrentPageProduct, selectCurrentSearchKeywordProduct, selectCurrentSortDirectionProduct } from '../../../features/products/productsSlice'

const EditProduct = () => {
  // get param
  const { id: idProduct } = useParams()

  const navigate = useNavigate()
  const dispatch = useDispatch()

  // locale state
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
  const [subCategories, setSubCategories] = useState([])
  const [showSubCategories, setShowSubCategories] = useState(true)
  const [msgSuccess, setMsgSuccess] = useState('')

  // global state categories
  const pageCategory = useSelector(selectCurrentPageCategories)
  const limitCategory = useSelector(selectCurrentLimitCategories)
  const columnCategory = useSelector(selectCurrentColumnCategories)
  const sortDirectionCategory = useSelector(selectCurrentSortDirectionCategories)
  const filterSearchCategory = useSelector(selectCurrentFilterSearchCategories)
  const searchKeywordCategory = useSelector(selectCurrentSearchKeywordCategories)

  // global state products
  const pageProduct = useSelector(selectCurrentPageProduct)
  const limitProduct = useSelector(selectCurrentLimitProduct)
  const columnProduct = useSelector(selectCurrentColumnProduct)
  const sortDirectionProduct = useSelector(selectCurrentSortDirectionProduct)
  const filterSearchProduct = useSelector(selectCurrentFilterSearchProduct)
  const searchKeywordProduct = useSelector(selectCurrentSearchKeywordProduct)

  const queryOptionsCategories = {
    page: pageCategory,
    limit: limitCategory,
    column: columnCategory,
    sortDirection: sortDirectionCategory ? 'asc' : 'desc',
    filter_search: filterSearchCategory,
    searchKeyword: searchKeywordCategory
  }

  const queryOptionsProducts = {
    page: pageProduct,
    limit: limitProduct,
    column: columnProduct,
    sortDirection: sortDirectionProduct ? 'asc' : 'desc',
    filter_search: filterSearchProduct,
    searchKeyword: searchKeywordProduct
  }

  // use get product by id
  const { data: productById, isLoading, status, refetch: refetchProductById } = useGetProductByIdQuery(idProduct)
  // use get categories
  const { data: categories } = useGetCategoriesQuery({ ...queryOptionsCategories, page: 0, limit: 100 })
  // use refetch products
  const { refetch: refetchProducts } = useGetProductsQuery(queryOptionsProducts)

  // set data to state
  useEffect(() => {
    if (productById) {
      setTitle(productById.product.title)
      setOldTitle(productById.product.title)
      setSlug(productById.product.slug)
      setOldSlug(productById.product.slug)
      setCategory(productById.product.id_category._id)
      setSubCategoryId(productById?.product?.id_sub_category?._id)
      setDescription(productById.product.description)
      setPrice(productById.product.price)
      setImage(productById.product.image)
      setImgPreview(productById.product.url)

      // call sub category
      getSubCategoryByCategoryId(productById.product.id_category._id)
    }
  }, [productById])

  // get sub category data
  const getSubCategoryByCategoryId = async (idCategory) => {
    try {
      const response = await dispatch(fetchSubCategoriesByCategoryId(idCategory))
      setSubCategories(response)
    } catch (error) {
      console.log(error)
    }
  }

  // handle change input
  const handleTitleChange = e => {
    const value = e.target.value
    setTitle(value)
    const newSlug = slugify(value, { lower: true })
    setSlug(newSlug)
  }
  const handleSlugChange = e => {
    const value = e.target.value
    const newSlug = slugify(value, { lower: true })
    setSlug(newSlug)
  }
  const handleDescriptionChange = (e, editor) => {
    setDescription(editor.getData())
  }
  const handleCategoryChange = async e => {
    const value = e.target.value
    if (value === '') {
      setShowSubCategories(false)
      setSubCategoryId('')
    } else {
      setShowSubCategories(true)
      try {
        const response = await dispatch(getSubCategoryByCategoryId(value))
        setSubCategories(response)
      } catch (error) {
        console.log(error)
      }
    }
    setCategory(value)
  }
  const handleChangeSubCategory = async e => {
    const value = e.target.value
    if (value === 'Select') {
      setSubCategoryId('')
    } else {
      setSubCategoryId(value)
    }
  }
  const handlePriceChange = e => {
    const value = e.target.value
    setPrice(value)
  }
  const handleImageChange = e => {
    const value = e.target.files[0]
    setImage(value)
    setImgPreview(URL.createObjectURL(value))
  }

  const handleCloseModalSuccess = () => {
    reset()
    setMsgSuccess('')
    navigate('/admin/dashboard/products')
  }

  // use update
  const [updateProduct, { isLoading: loadingUpdate, isError, error, isSuccess, reset }] = useUpdateProductMutation()
  const handleEditProduct = async event => {
    event.preventDefault()
    const productData = new FormData()
    productData.append('title', title)
    productData.append('oldTitle', oldTitle)
    productData.append('slug', slug)
    productData.append('oldSlug', oldSlug)
    productData.append('description', description)
    productData.append('price', price)
    productData.append('category', category)
    productData.append('subCategoryId', subCategoryId)
    productData.append('image', image)
    productData.append('idProduct', idProduct)
    try {
      const response = await updateProduct(productData).unwrap()
      setMsgSuccess(response.msg)

      // call refetch data
      await refetchProducts()
      await refetchProductById()

      setTimeout(() => {
        setMsgSuccess('')
        navigate('/admin/dashboard/products')
      }, 2000);
    } catch (error) {
      return
    }
  }

  return (
    <>
      {isLoading || status === 'pending' ? <LoadingSpinner /> : null}
      {loadingUpdate ? <LoadingSpinner /> : null}

      {isSuccess ?
        <ModalSuccess
          msg={msgSuccess}
          close={handleCloseModalSuccess} />
        : null
      }

      <div className="w-full bg-white rounded-lg shadow">
        <div className="p-6 space-y-4">
          <h1 className="text-xl font-semibold leading-tight tracking-tight text-slate-800">
            Edit Product
          </h1>
          <form onSubmit={handleEditProduct} className="space-y-4 md:space-y-6">

            {isError &&
              (<AlertErrors msg={error.data.msg} close={reset} />)
            }

            <div className='flex'>
              <div className='w-1/2 mr-3'>
                <div>
                  <label className="block mb-2 text-textSecondary text-sm font-medium">
                    Title
                  </label>
                  <input
                    type="title"
                    name="title"
                    id="title"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Title"
                    value={title}
                    onChange={handleTitleChange}
                  />
                  <input type='hidden' value={oldTitle} readOnly />
                </div>
              </div>
              <div className='w-1/2 mr-3'>
                <div>
                  <label className="block mb-2 text-textSecondary text-sm font-medium">
                    Slug
                  </label>
                  <input
                    type="slug"
                    name="slug"
                    id="slug"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="Slug"
                    value={slug}
                    onChange={handleSlugChange}
                  />
                  <input type='hidden' value={oldSlug} readOnly />
                </div>
              </div>

            </div>
            <div className='flex'>
              <div className='mr-3'>
                <div className='relative'>
                  <label className="block mb-2 text-textSecondary text-sm font-medium">
                    Kategori
                  </label>
                  <select
                    className='block appearance-none w-40 bg-gray-50 border border-gray-300 text-gray-900 py-2 px-4 pr-8leading-tight focus:outline-none rounded-lg focus:bg-white focus:border-gray-500'
                    value={category}
                    onChange={handleCategoryChange}>
                    <option value=''>Select</option>
                    {categories?.data.map(cate => (
                      <option key={cate._id} value={cate._id}>{cate.title}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 flex items-center px-2 text-gray-700 left-32 mt-7">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              {showSubCategories ?
                <div className='mr-3'>
                  <div className='relative'>
                    <label className="block mb-2 text-textSecondary text-sm font-medium">
                      Sub Kategori (Optional)
                    </label>
                    <select
                      className='block appearance-none w-40 bg-gray-50 border border-gray-300 text-gray-900 py-2 px-4 pr-8leading-tight focus:outline-none rounded-lg focus:bg-white focus:border-gray-500'
                      value={subCategoryId}
                      onChange={handleChangeSubCategory}>
                      <option>Select</option>
                      {subCategories?.map(cate => (
                        <option key={cate._id} value={cate._id}>{cate.title}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 flex items-center px-2 text-gray-700 left-32 mt-7">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
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
                  <label className="block mb-2 text-textSecondary text-sm font-medium">
                    Price
                  </label>
                  <input
                    type="price"
                    name="price"
                    id="price"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    placeholder="2.500.000"
                    value={price}
                    onChange={handlePriceChange}
                  />
                </div>
              </div>
            </div>
            <div className='flex'>
              <div className='w-1/3'>
                <label className="block mb-2 text-textSecondary text-sm font-medium">
                  Image
                </label>
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
            <button
              type="submit"
              className="w-1/3 text-textPrimary hover:bg-hoverBgButton hover:text-white border border-borderButton focus:ring-2 focus:outline-none focus:ring-ringFocusBtn font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              disabled={loadingUpdate || msgSuccess !== ''}
            >Edit Product
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default EditProduct
