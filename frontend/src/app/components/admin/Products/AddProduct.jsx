import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import slugify from 'slugify'
import { useGetCategoriesQuery } from '../../../features/categories/categoriesApiSlice'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSubCategoriesByCategoryId } from '../../../features/sub-categories/subCategoriesSlice'
import { useAddProductMutation, useGetProductsQuery } from '../../../features/products/productsApiSlice'
import AlertErrors from '../../layouts/AlertErrors'
import LoadingSpinner from '../../layouts/LoadingSpinner'
import ModalSuccess from '../../layouts/ModalSuccess'
import { selectCurrentColumnCategories, selectCurrentFilterSearchCategories, selectCurrentLimitCategories, selectCurrentPageCategories, selectCurrentSearchKeywordCategories, selectCurrentSortDirectionCategories } from '../../../features/categories/categoriesSlice'
import { resetPaginationProduct, selectCurrentColumnProduct, selectCurrentFilterSearchProduct, selectCurrentLimitProduct, selectCurrentPageProduct, selectCurrentSearchKeywordProduct, selectCurrentSortDirectionProduct } from '../../../features/products/productsSlice'

const AddProduct = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // state form local      
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [file, setFile] = useState('')
  const [subCategoryId, setSubCategoryId] = useState('')
  const [imgPreview, setImgPreview] = useState('')
  const [showSubCategories, setShowSubCategories] = useState(false)
  const [optSubCate, setOptSubCate] = useState([])
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

  // use get categories
  const { data: categories } = useGetCategoriesQuery({ ...queryOptionsCategories, page: 0, limit: 50 })

  const queryOptionsProducts = {
    page: pageProduct,
    limit: limitProduct,
    column: columnProduct,
    sortDirection: sortDirectionProduct ? 'asc' : 'desc',
    filter_search: filterSearchProduct,
    searchKeyword: searchKeywordProduct
  }

  // use refetch products
  const { refetch } = useGetProductsQuery(queryOptionsProducts)

  // handle change input
  const handleTitle = (e) => {
    const value = e.target.value
    setTitle(value)
    const newSlug = slugify(value, { lower: true })
    setSlug(newSlug)
    reset()
  }
  const handleSlug = (e) => {
    const value = e.target.value
    const newSlug = slugify(value, { lower: true })
    setSlug(newSlug)
    reset()
  }
  const handleDescription = (e, editor) => {
    setDescription(editor.getData())
    reset()
  }
  const handleCategory = async (e) => {
    const value = e.target.value
    if (value === '') {
      setShowSubCategories(false)
    } else {
      setShowSubCategories(true)
      // get sub category by id category
      try {
        const response = await dispatch(fetchSubCategoriesByCategoryId(value))
        setOptSubCate(response)
      } catch (error) {
        console.log(error)
      }
    }
    setCategory(value)
    reset()
  }
  const handleChangeSubCategory = (e) => {
    const value = e.target.value
    setSubCategoryId(value)
    reset()
  }
  const handlePrice = (e) => {
    const value = e.target.value
    setPrice(value)
    reset()
  }
  const handleImageChange = e => {
    const value = e.target.files[0]
    setFile(value)
    setImgPreview(URL.createObjectURL(value))
    reset()
  }

  // close modal success
  const handleCloseModalSuccess = () => {
    reset()
    setMsgSuccess('')
    navigate('/admin/dashboard/products')
  }

  // use add product
  const [addProduct, { isLoading, isError, error, isSuccess, reset }] = useAddProductMutation()
  const handleAddProduct = async event => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('title', title)
    formData.append('slug', slug)
    formData.append('description', description)
    formData.append('category', category)
    formData.append('subCategoryId', subCategoryId)
    formData.append('price', price)
    formData.append('file', file)
    try {
      const response = await addProduct(formData).unwrap()
      setMsgSuccess(response.msg)
      // call refetch products
      await refetch()
      await dispatch(resetPaginationProduct())
      // navigate
      setTimeout(() => {
        setMsgSuccess('')
        navigate('/admin/dashboard/products')
      }, 2000)
    } catch (error) {
      return
    }
  }

  return (
    <>

      {isLoading ? <LoadingSpinner /> : null}
      {isSuccess ?
        <ModalSuccess
          msg={msgSuccess}
          close={handleCloseModalSuccess} />
        : null
      }

      <div className="w-full bg-white rounded-lg shadow">
        <div className="p-6 space-y-4">
          <h1 className="text-xl font-semibold leading-tight tracking-tight text-textPrimary">
            Form Add Product
          </h1>
          <div className='border-b border-zinc-200'></div>

          <form onSubmit={handleAddProduct} className="space-y-4 md:space-y-6">
            {/* error message */}
            {isError &&
              (<AlertErrors msg={error?.data?.msg} close={reset} />)
            }
            <div className='flex'>
              <div className='w-1/2 mr-3'>
                <div>
                  <label className="block mb-2 text-textPrimary text-sm font-semibold">
                    Title
                  </label>
                  <input
                    type="title"
                    name="title"
                    id="title"
                    className="bg-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5"
                    placeholder="Title"
                    value={title}
                    onChange={handleTitle}
                  />
                </div>
              </div>

              <div className='w-1/2 mr-3'>
                <div>
                  <label className="block mb-2 text-textPrimary text-sm font-semibold">
                    Slug
                  </label>
                  <input
                    type="slug"
                    name="slug"
                    id="slug"
                    className="bg-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5"
                    placeholder="Slug"
                    value={slug}
                    onChange={handleSlug}
                  />
                </div>
              </div>
            </div>

            <div className='flex'>
              <div className='flex'>
                <div className='relative mr-3'>
                  <label className="block mb-2 text-textPrimary text-sm font-semibold">
                    Category
                  </label>
                  <select
                    className='block text-sm appearance-none w-40 bg-bgInput border border-borderInput text-textPrimary py-2 px-4 pr-8 leading-tight focus:outline-none rounded-lg focus:bg-white focus:border-zinc-500'
                    onChange={handleCategory}
                    value={category}>
                    <option value=''>Select Category</option>
                    {categories?.data.map(cate => (
                      <option key={cate._id} value={cate._id}>{cate.title}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 flex items-center px-2 text-textPrimary left-32 mt-7">
                    <svg
                      className="fillCurrent h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>

                {!showSubCategories ? null :
                  <>
                    <div className='relative'>
                      <label className="block mb-2 text-textPrimary text-sm font-semibold">
                        Sub Category (Optional)
                      </label>
                      <select
                        className='block text-sm appearance-none w-40 bg-bgInput border border-borderInput text-textPrimary py-2 px-4 pr-8 leading-tight focus:outline-none rounded-lg focus:bg-white focus:border-zinc-500'
                        value={subCategoryId}
                        onChange={handleChangeSubCategory}>
                        <option value=''>Sub Category</option>
                        {optSubCate?.map(subcate => (
                          <option key={subcate._id} value={subcate._id}>{subcate.title}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 flex items-center px-2 text-textPrimary left-32 mt-7">
                        <svg
                          className="fillCurrent h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </>
                }

              </div>
            </div>

            <div className='block'>
              <label
                className="block mb-2 text-textPrimary text-sm font-semibold">
                Description
              </label>
              <CKEditor
                editor={ClassicEditor}
                data={description}
                onChange={handleDescription}
              />
            </div>

            <div className='flex'>
              <div className='w-1/3 mr-3'>
                <div>
                  <label className="block mb-2 text-textPrimary text-sm font-semibold">
                    Price
                  </label>
                  <input
                    type="price"
                    name="price"
                    id="price"
                    className="bg-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5"
                    placeholder="2.500.000"
                    value={price}
                    onChange={handlePrice} />
                </div>
              </div>
            </div>

            <div className='flex'>
              <div className='w-1/3'>
                <label className="block mb-2 text-textPrimary text-sm font-semibold">
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
              disabled={isLoading || msgSuccess !== ''}
            >Add Product
            </button>

          </form>
        </div>
      </div>
    </>
  )
}

export default AddProduct
