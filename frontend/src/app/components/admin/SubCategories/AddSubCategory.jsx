import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../layouts/LoadingSpinner'
import { useGetCategoriesQuery } from '../../../features/categories/categoriesApiSlice'
import slugify from 'slugify'
import { useAddSubCategoryMutation, useGetSubCategoriesQuery } from '../../../features/sub-categories/subCategoryApiSlice'
import AlertErrors from '../../layouts/AlertErrors'
import { useDispatch, useSelector } from 'react-redux'
import anime from 'animejs'
import { resetPaginationSubCategories, selectCurrentColumnSubCategories, selectCurrentFilterSearchSubCategories, selectCurrentLimitSubCategories, selectCurrentPageSubCategories, selectCurrentSearchKeywordSubCategories, selectCurrentSortDirectionSubCategories, setSuccess } from '../../../features/sub-categories/subCategoriesSlice'
import { selectCurrentColumnCategories, selectCurrentFilterSearchCategories, selectCurrentLimitCategories, selectCurrentPageCategories, selectCurrentSearchKeywordCategories, selectCurrentSortDirectionCategories } from '../../../features/categories/categoriesSlice'

const AddSubCategory = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // animate modal
  const layoutModalRef = useRef(null)
  useEffect(() => {
    anime({
      targets: layoutModalRef.current,
      translateY: 250,
      duration: 500,
      autoplay: true,
      easing: 'easeInOutSine'
    })
  }, [])

  // locale state
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
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

  // get categories
  const { data: categories } = useGetCategoriesQuery({ ...queryOptionsCategories, page: 0, limit: 50 })

  // handle change input
  const handleChangeTitle = (e) => {
    const value = e.target.value
    setTitle(value)
    const newSlug = slugify(value, { lower: true })
    setSlug(newSlug)
  }
  const handleChangeSlug = (e) => {
    const value = e.target.value
    const newSlug = slugify(value, { lower: true })
    setSlug(newSlug)
  }
  const handleChangeCategoryId = (e) => {
    const value = e.target.value
    setCategoryId(value)
  }

  // use get for refetch sub categories
  const { refetch: refetchSubCategories } = useGetSubCategoriesQuery({ ...queryOptionsSubCategories, limit: 3 })

  const handleCloseModal = () => {
    navigate('/admin/dashboard/sub-categories')
  }

  // use add sub category
  const [addSubCategory, { isLoading, isError, error, reset }] = useAddSubCategoryMutation()
  const handleAddSubCategory = async (e) => {
    e.preventDefault()
    try {
      const response = await addSubCategory({ title, slug, categoryId }).unwrap()
      await refetchSubCategories()
      await dispatch(resetPaginationSubCategories())
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
      {isLoading ? <LoadingSpinner /> : null}

      <div ref={layoutModalRef}
        className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[70] outline-none focus:outline-none"
      >
        <div className="relative w-1/4 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between px-6 py-4 border-b border-solid border-zinc-200 rounded-t">
              <h3 className="font-semibold text-base md:text-lg text-textPrimary">
                Form Add Sub Category
              </h3>
              <button onClick={handleCloseModal}>
                <i className="uil uil-multiply text-textPrimary font-semibold hover:text-red-500"></i>
              </button>
            </div>
            {/*body*/}
            <div className="p-7">

              <form onSubmit={handleAddSubCategory} action='#'>

                {/* error message */}
                {isError && (
                  <AlertErrors msg={error.data.msg} close={reset} />
                )}

                <div className='mb-2'>
                  <div>
                    <label className="mb-2 text-sm font-bold text-textPrimary">Title</label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Nama kategori"
                      className="g-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5"
                      value={title}
                      onChange={handleChangeTitle}
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="mb-2 text-sm font-bold text-textPrimary">Slug</label>
                  <input
                    type="text"
                    name="slug"
                    placeholder="slug"
                    className="g-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5"
                    value={slug}
                    onChange={handleChangeSlug}
                  />
                </div>
                <div className='mt-2'>
                  <div className='relative'>
                    <label className="mb-2 text-sm font-bold text-textPrimary">Kategori</label>
                    <select
                      className='cursor-pointer block appearance-none w-1/2 text-sm text-textPrimary bg-bgInput border border-borderInput py-2.5 px-4 pr-8 leading-tight focus:outline-none rounded-lg focus:bg-white focus:border-focusBorderInput'
                      value={categoryId}
                      onChange={handleChangeCategoryId}>
                      <option>Pilih Kategori</option>
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
                  Tambah
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-[60] bg-black"></div>
    </>
  )
}

export default AddSubCategory
