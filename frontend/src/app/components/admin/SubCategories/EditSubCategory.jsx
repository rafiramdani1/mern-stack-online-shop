import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import slugify from 'slugify'
import { useGetSubCategoriesQuery, useGetSubCategoryByIdQuery, useUpdateSubCategoryMutation } from '../../../features/sub-categories/subCategoryApiSlice'
import { useGetCategoriesQuery } from '../../../features/categories/categoriesApiSlice'
import AlertErrors from '../../layouts/AlertErrors'
import LoadingSpinner from '../../layouts/LoadingSpinner'
import ModalSuccess from '../../layouts/ModalSuccess'

const EditSubCategory = () => {

  // get param
  const { id: idSubCategory } = useParams()

  const navigate = useNavigate()

  // locale state
  const [subCategory, setSubCategory] = useState('')
  const [oldSubCategory, setOldSubCategory] = useState('')
  const [slug, setSlug] = useState('')
  const [oldSlug, setOldSlug] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [msgSuccess, setMsgSuccess] = useState('')

  // use get sub categories by id
  const { data: subCategoryById, isLoading: loadingGetSubCategory, refetch: refetchGetSubCategoryById } = useGetSubCategoryByIdQuery(idSubCategory)

  // use get categories
  const { data: categories, isLoading: loadingGetCategories } = useGetCategoriesQuery()

  // set data to state
  useEffect(() => {
    if (subCategoryById) {
      setSubCategory(subCategoryById.title)
      setOldSubCategory(subCategoryById.title)
      setSlug(subCategoryById.slug)
      setOldSlug(subCategoryById.slug)
      setCategoryId(subCategoryById.id_category._id)
    }
  }, [subCategoryById])

  // handle change input
  const handleChangeSubCategory = (e) => {
    const value = e.target.value
    setSubCategory(value)
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
    console.log(value)
    reset()
  }

  // use update sub category
  const [updateSubCategory, { isLoading, isError, error, isSuccess, reset }] = useUpdateSubCategoryMutation()

  // use refetch sub categories
  const { refetch: refetchSubCategories } = useGetSubCategoriesQuery()

  // close modal success
  const handleCloseModalSuccess = () => {
    reset()
    setMsgSuccess('')
    navigate('/admin/dashboard/sub-categories')
  }

  // handle update sub category
  const handleUpdateSubCategory = async event => {
    event.preventDefault()
    try {
      const response = await updateSubCategory({ subCategory, oldSubCategory, slug, oldSlug, categoryId, idSubCategory }).unwrap()
      setMsgSuccess(response.msg)

      // call refetch sub categories data
      await refetchSubCategories()
      await refetchGetSubCategoryById()

      // navigate
      setTimeout(() => {
        setMsgSuccess('')
        navigate('/admin/dashboard/sub-categories')
      }, 2000)
    } catch (error) {
      return
    }
  }

  return (
    <>
      {isLoading ? <LoadingSpinner /> : null}

      {isSuccess ? <ModalSuccess msg={msgSuccess} close={handleCloseModalSuccess} /> : null}

      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[70] outline-none focus:outline-none"
      >
        <div className="relative w-1/3 my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between px-6 py-5 border-b border-solid border-zinc-200 rounded-t">
              <h3 className="font-semibold text-base md:text-lg text-textPrimary">
                Edit Sub-Kategori
              </h3>
            </div>
            {/*body*/}
            <div className="p-6">

              <form onSubmit={handleUpdateSubCategory} className="w-full max-w-lg" action='#'>

                {isError && (<AlertErrors msg={error.data.msg} close={reset} />)}

                <div className='mb-2'>
                  <label
                    className="mb-2 text-sm font-bold text-textPrimary">Sub Kategori</label>
                  <input type="text" name="title" placeholder="Sub kategori"
                    className="bg-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5" value={subCategory} onChange={handleChangeSubCategory} />
                  <input type='hidden' value={oldSubCategory} readOnly />
                </div>

                <div>
                  <label
                    className="mb-2 text-sm font-bold text-textPrimary">Slug</label>
                  <input type="text" name="slug" placeholder="slug"
                    className="bg-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5" value={slug} onChange={handleChangeSlug} />
                  <input type='hidden' value={oldSlug} readOnly />
                </div>

                <div className='mt-2'>
                  <div className='relative'>
                    <label className="mb-2 text-sm font-bold text-textPrimary">Kategori</label>
                    <select className='block appearance-none w-1/2 text-sm text-textPrimary bg-bgInput border border-borderInput py-2.5 px-4 pr-8 leading-tight focus:outline-none rounded-lg focus:bg-white focus:border-zinc-500' value={categoryId} onChange={handleChangeCategory}>
                      <option value=''>Pilih Kategori</option>
                      {categories?.map(category => (
                        <option key={category._id} value={category._id}>{category.title}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 flex items-center px-2 text-textPrimary left-40 mt-7">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>
                </div>

                <button type="submit"
                  className="w-full font-medium text-textPrimary hover:text-white hover:bg-hoverBgButton border border-borderButton focus:ring-2 focus:outline-none focus:ring-ringFocusBtn rounded-lg text-sm px-5 py-2.5 text-center mt-5"
                  disabled={isLoading || msgSuccess !== ''}
                >Edit</button>
              </form>

            </div>

            {/*footer*/}
            <div className="flex items-center justify-end p-3 border-t border-solid border-zinc-200 rounded-b">
              <Link to='/admin/dashboard/sub-categories'
                className="text-textPrimary font-medium rounded-lg text-sm px-4 py-2 hover:text-red-600"
                type="button"
              >
                tutup
              </Link>
            </div>

          </div>
        </div>
      </div>
      <div className="opacity-40 fixed inset-0 z-[60] bg-black"></div>
    </>

  )
}

export default EditSubCategory
