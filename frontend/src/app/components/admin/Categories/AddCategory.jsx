import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAddCategoryMutation, useGetCategoriesQuery } from '../../../features/categories/categoriesApiSlice'
import LoadingSpinner from '../../layouts/LoadingSpinner'
import AlertErrors from '../../layouts/AlertErrors'
import slugify from 'slugify'
import ModalSuccess from '../../layouts/ModalSuccess'

const AddCategory = () => {

  const titleRef = useRef()
  const navigate = useNavigate()

  // locale state
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    titleRef.current.focus()
  }, [])

  const handleCloseModal = () => {
    navigate('/admin/dashboard/categories')
  }

  // onchange input
  const handleChangeTitle = (event) => {
    const value = event.target.value
    setTitle(value)
    const newSlug = slugify(value, { lower: true })
    setSlug(newSlug)
    reset()
  }

  const handleChangeSlug = (event) => {
    const value = slugify(event.target.value, { lower: true })
    setSlug(value)
    reset()
  }

  // use add category
  const [addCategory, { isLoading, isError, isSuccess, error, reset }] = useAddCategoryMutation()

  // call refetch categories
  const { refetch } = useGetCategoriesQuery()

  const handleCloseModalSuccess = () => {
    reset()
    setSuccessMsg('')
    navigate('/admin/dashboard/categories')
  }

  // handle add category
  const handleAddCategory = async (event) => {
    event.preventDefault()
    try {
      const response = await addCategory({ title, slug }).unwrap()
      setSuccessMsg(response.msg)

      // call refetch categories data
      await refetch()

      if (response.status === true) {
        setTimeout(() => {
          setSuccessMsg('')
          navigate('/admin/dashboard/categories')
        }, 2000)
      }
    } catch (error) {
      return
    }
  }


  return (
    <>
      {isLoading ? <LoadingSpinner /> : null}
      {isSuccess ? <ModalSuccess msg={successMsg} close={handleCloseModalSuccess} /> : null}

      <div className="justify-center top-20 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[70] outline-none focus:outline-none">
        <div className="relative w-1/3 my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between px-6 py-4 border-b border-solid border-zinc-200 rounded-t">
              <h3 className="font-semibold text-base md:text-lg text-textPrimary">
                Tambah Kategori
              </h3>
              <button onClick={handleCloseModal}><i className="uil uil-multiply text-textPrimary font-semibold hover:text-red-500"></i></button>
            </div>
            {/*body*/}
            <div className="p-6">

              {/* error message */}
              {isError ? <AlertErrors msg={error.data.msg} close={reset} /> : null}

              <form onSubmit={handleAddCategory} className="w-full max-w-lg" action='#'>

                <div className='mb-2'>
                  <div>
                    <label className="mb-2 text-sm font-bold text-textPrimary">Title</label>
                    <input
                      ref={titleRef}
                      type="text"
                      name="title"
                      placeholder="Nama kategori"
                      className="bg-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5"
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
                    className="bg-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5"
                    value={slug}
                    onChange={handleChangeSlug}
                  />
                </div>

                <button type="submit"
                  className="w-full font-medium text-textPrimary hover:text-white hover:bg-hoverBgButton border border-borderButton focus:ring-2 focus:outline-none focus:ring-ringFocusBtn rounded-lg text-sm px-5 py-2.5 text-center mt-5"
                  disabled={isLoading || successMsg !== ''}
                >Tambah</button>
              </form>

            </div>

          </div>
        </div>
      </div>
      <div className="opacity-40 fixed inset-0 z-[60] bg-black"></div>
    </>
  )
}

export default AddCategory