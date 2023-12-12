import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import slugify from 'slugify'
import AlertErrors from '../../layouts/AlertErrors'
import LoadingSpinner from '../../layouts/LoadingSpinner'
import { useGetCategoriesQuery, useGetCategoryByIdQuery, useUpdateCategoryMutation } from '../../../features/categories/categoriesApiSlice'
import ModalSuccess from '../../layouts/ModalSuccess'

const EditCategory = () => {

  // get param
  const { id: idCategory } = useParams()

  const navigate = useNavigate()

  // state form
  const [title, setTitle] = useState('')
  const [oldTitle, setOldTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [oldSlug, setOldSlug] = useState('')
  const [msgSuccess, setMsgSuccess] = useState('')

  // use get category by id
  const { data: categoryById, isLoading: getCategoryLoading, refetch: refetchCategoryById } = useGetCategoryByIdQuery(idCategory)

  // use refetch categories
  const { refetch: refetchGetCategories } = useGetCategoriesQuery()

  useEffect(() => {
    if (categoryById) {
      setTitle(categoryById.title)
      setOldTitle(categoryById.title)
      setSlug(categoryById.slug)
      setOldSlug(categoryById.slug)
    }
  }, [categoryById])

  // handle close modal edit
  const handleCloseModalEdit = () => {
    navigate('/admin/dashboard/categories')
  }

  // onchange title
  const handleChangeTitle = (event) => {
    const value = event.target.value
    setTitle(value)
    const newSlug = slugify(value, { lower: true })
    setSlug(newSlug)
  }

  // onchange slug
  const handleChangeSlug = (event) => {
    const value = slugify(event.target.value, { lower: true })
    setSlug(value)
  }

  // use update category
  const [updateCategory, { isLoading: updateCategoryLoading, isError, error, isSuccess, reset }] = useUpdateCategoryMutation()

  const handleCloseModalSuccess = () => {
    reset()
    setMsgSuccess('')
    navigate('/admin/dashboard/categories')
  }

  // handle edit category
  const handleUpdateCategory = async (e) => {
    e.preventDefault()
    try {
      const response = await updateCategory({ title, oldTitle, slug, oldSlug, idCategory }).unwrap()
      setMsgSuccess(response.msg)

      // call refetch data categories
      await refetchGetCategories()
      await refetchCategoryById()

      // navigate
      if (response.status === true) {
        setTimeout(() => {
          setMsgSuccess('')
          navigate('/admin/dashboard/categories')
        }, 2000)
      }
    } catch (error) {
      return
    }
  }

  return (
    <>
      {updateCategoryLoading ? <LoadingSpinner /> : null}

      {isSuccess ? <ModalSuccess msg={msgSuccess} close={handleCloseModalSuccess} /> : null}

      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[70] outline-none focus:outline-none">
        <div className="relative w-1/3 my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between px-6 py-4 border-b border-solid border-zinc-200 rounded-t">
              <h3 className="font-semibold text-base md:text-lg text-textPrimary">
                Edit Kategori
              </h3>
              <button onClick={handleCloseModalEdit}><i className="uil uil-multiply text-textPrimary font-semibold hover:text-red-500"></i></button>
            </div>
            {/*body*/}
            <div className="p-6">

              <form onSubmit={handleUpdateCategory} className="w-full max-w-lg" action='#'>

                {/* error message */}
                {isError && (<AlertErrors msg={error.data.msg} close={reset} />)}

                <div className='mb-2'>
                  <label
                    className="mb-2 text-sm font-bold text-textPrimary">Title</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="nama kategori"
                    className="bg-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5"
                    value={title}
                    onChange={handleChangeTitle}
                  />
                  <input type='hidden' value={title} readOnly />
                </div>

                <div>
                  <label className="mb-2 text-sm font-bold text-textPrimary">Slug</label>
                  <input
                    type="text"
                    name="slug"
                    placeholder="slug"
                    className="bg-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5"
                    value={slug}
                    onChange={handleChangeSlug} />
                  <input type='hidden' value={slug} readOnly />
                </div>
                <button
                  type="submit"
                  className="w-full font-medium text-textPrimary hover:text-white hover:bg-hoverBgButton border border-borderButton focus:ring-2 focus:outline-none focus:ring-ringFocusBtn rounded-lg text-sm px-5 py-2.5 text-center mt-5"
                  disabled={updateCategoryLoading || msgSuccess !== ''}
                >Edit</button>
              </form>
            </div>

          </div>
        </div>
      </div>
      <div className="opacity-40 fixed inset-0 z-[60] bg-black"></div>
    </>

  )
}

export default EditCategory
