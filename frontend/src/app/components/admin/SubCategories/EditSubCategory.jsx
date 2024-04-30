import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import slugify from 'slugify'
import { useGetSubCategoriesQuery, useGetSubCategoryByIdQuery, useUpdateSubCategoryMutation } from '../../../features/sub-categories/subCategoryApiSlice'
import { useGetCategoriesQuery } from '../../../features/categories/categoriesApiSlice'
import AlertErrors from '../../layouts/AlertErrors'
import LoadingSpinner from '../../layouts/LoadingSpinner'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentColumnSubCategories, selectCurrentFilterSearchSubCategories, selectCurrentLimitSubCategories, selectCurrentPageSubCategories, selectCurrentSearchKeywordSubCategories, selectCurrentSortDirectionSubCategories, setSuccess } from '../../../features/sub-categories/subCategoriesSlice'
import { selectCurrentColumnCategories, selectCurrentFilterSearchCategories, selectCurrentLimitCategories, selectCurrentPageCategories, selectCurrentSearchKeywordCategories, selectCurrentSortDirectionCategories } from '../../../features/categories/categoriesSlice'

const EditSubCategory = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  // get param
  const { id: idSubCategory } = useParams()

  // use get sub categories by id
  const { data: subCategoryById, isLoading: loadingGetSubCategoryById, status, refetch: refetchGetSubCategoryById } = useGetSubCategoryByIdQuery(idSubCategory)

  // locale state
  const [title, setTitle] = useState('')
  const [oldTitle, setOldTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [oldSlug, setOldSlug] = useState('')
  const [categoryId, setCategoryId] = useState('')

  // global state sub categories
  const pageSubCategory = useSelector(selectCurrentPageSubCategories)
  const limitSubCategory = useSelector(selectCurrentLimitSubCategories)
  const columnSubCategory = useSelector(selectCurrentColumnSubCategories)
  const sortDirectionSubCategory = useSelector(selectCurrentSortDirectionSubCategories)
  const filterSearchSubCategory = useSelector(selectCurrentFilterSearchSubCategories)
  const searchKeywordSubCategory = useSelector(selectCurrentSearchKeywordSubCategories)

  // global state categories
  const pageCategory = useSelector(selectCurrentPageCategories)
  const limitCategory = useSelector(selectCurrentLimitCategories)
  const columnCategory = useSelector(selectCurrentColumnCategories)
  const sortDirectionCategory = useSelector(selectCurrentSortDirectionCategories)
  const filterSearchCategory = useSelector(selectCurrentFilterSearchCategories)
  const searchKeywordCategory = useSelector(selectCurrentSearchKeywordCategories)

  const queryOptionsSubCategories = {
    page: pageSubCategory,
    limit: limitSubCategory,
    column: columnSubCategory,
    sortDirection: sortDirectionSubCategory ? 'asc' : 'desc',
    filter_search: filterSearchSubCategory,
    searchKeyword: searchKeywordSubCategory
  }

  const queryOptionsCategories = {
    page: pageCategory,
    limit: limitCategory,
    column: columnCategory,
    sortDirection: sortDirectionCategory ? 'asc' : 'desc',
    filter_search: filterSearchCategory,
    searchKeyword: searchKeywordCategory
  }

  // use get categories
  const { data: categories, isLoading: loadingGetCategories } = useGetCategoriesQuery({ ...queryOptionsCategories, page: 0, limit: 50 })

  // set data to state
  useEffect(() => {
    if (subCategoryById) {
      setTitle(subCategoryById.title)
      setOldTitle(subCategoryById.title)
      setSlug(subCategoryById.slug)
      setOldSlug(subCategoryById.slug)
      setCategoryId(subCategoryById.id_category._id)
    }
  }, [subCategoryById])

  // handle change input
  const handleChangeSubCategory = (e) => {
    const value = e.target.value
    setTitle(value)
    const newSlug = slugify(value, { lower: true })
    setSlug(newSlug)
    reset()
  }
  const handleChangeSlug = (e) => {
    const value = e.target.value
    const newSlug = slugify(value, { lower: true })
    setSlug(newSlug)
    reset()
  }
  const handleChangeCategory = (e) => {
    const value = e.target.value
    setCategoryId(value)
    reset()
  }

  // use update sub category
  const [updateSubCategory, { isLoading, isError, error, isSuccess, reset }] = useUpdateSubCategoryMutation()

  // use refetch sub categories
  const { refetch: refetchSubCategories } = useGetSubCategoriesQuery({ ...queryOptionsSubCategories, limit: 3 })

  // handle close modal edit
  const handleCloseModalEdit = () => {
    navigate('/admin/dashboard/sub-categories')
  }

  // handle update sub category
  const handleUpdateSubCategory = async event => {
    event.preventDefault()
    try {
      const response = await updateSubCategory({ title, oldTitle, slug, oldSlug, categoryId, idSubCategory }).unwrap()
      await refetchSubCategories()
      await refetchGetSubCategoryById()
      if (response.status === true) {
        navigate('/admin/dashboard/sub-categories')
        await dispatch(setSuccess({ success: true, msg: response.msg }))
      }
    } catch (error) {
      return
    }
  }

  return (
    <>
      {loadingGetSubCategoryById || status === 'pending' ? <LoadingSpinner /> : null}
      {isLoading ? <LoadingSpinner /> : null}
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[70] outline-none focus:outline-none">
        <div className="relative w-1/4 my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between px-6 py-4 border-b border-solid border-zinc-200 rounded-t">
              <h3 className="font-semibold text-base md:text-lg text-textPrimary">
                Form Edit Sub Category
              </h3>
              <button onClick={handleCloseModalEdit}>
                <i className="uil uil-multiply text-textPrimary font-semibold hover:text-red-500"></i>
              </button>
            </div>
            {/*body*/}
            <div className="p-6">

              <form onSubmit={handleUpdateSubCategory} action='#'>
                {isError && (
                  <AlertErrors msg={error.data.msg} close={reset} />
                )}
                <div className='mb-2'>
                  <label
                    className="mb-2 text-sm font-bold text-textPrimary">Sub Kategori name</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Sub category"
                    className="bg-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5"
                    value={title}
                    onChange={handleChangeSubCategory} />
                  <input type='hidden' value={oldTitle} readOnly />
                </div>

                <div>
                  <label
                    className="mb-2 text-sm font-bold text-textPrimary">Slug</label>
                  <input
                    type="text"
                    name="slug"
                    placeholder="slug"
                    className="bg-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5"
                    value={slug}
                    onChange={handleChangeSlug} />
                  <input type='hidden' value={oldSlug} readOnly />
                </div>

                <div className='mt-2'>
                  <div className='relative'>
                    <label className="mb-2 text-sm font-bold text-textPrimary">Category</label>
                    <select
                      className='block appearance-none w-1/2 text-sm text-textPrimary bg-bgInput border border-borderInput py-2.5 px-4 pr-8 leading-tight focus:outline-none rounded-lg focus:bg-white focus:border-zinc-500'
                      value={categoryId}
                      onChange={handleChangeCategory}>
                      <option value=''>Pilih Kategori</option>
                      {categories?.data.map(category => (
                        <option key={category._id} value={category._id}>{category.title}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 flex items-center px-2 text-textPrimary right-56 mt-7">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full font-medium text-textPrimary hover:text-white hover:bg-hoverBgButton border border-borderButton focus:ring-2 focus:outline-none focus:ring-ringFocusBtn rounded-lg text-sm px-5 py-2.5 text-center mt-5"
                  disabled={isLoading}>
                  Edit sub category
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-40 fixed inset-0 z-[60] bg-black"></div>
    </>

  )
}

export default EditSubCategory
