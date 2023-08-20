import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { CategoriesContext } from './CategoriesContext'
import AlertErrors from './../../Layouts/AlertErrors'
import ModalSuccess from '../../Layouts/ModalSuccess'
import LoadingSpinner from '../../Layouts/Loading'
import slugify from 'slugify'

const AddCategory = () => {

  const { addCategories, msgErrors, clearError, msgSuccess } = useContext
    (CategoriesContext)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [showModalSuccess, setShowModalSuccess] = useState(false)
  const [loadingSpinner, setLoadingSpinner] = useState(false)
  const navigate = useNavigate()

  const handleChangeTitle = (e) => {
    const value = e.target.value
    setTitle(value)
    const newSlug = slugify(value, { lower: true })
    setSlug(newSlug)
    clearError()
  }

  const handleChangeSlug = (e) => {
    const value = slugify(e.target.value, { lower: true })
    setSlug(value)
    clearError()
  }

  const handleCloseModalAdd = () => {
    clearError()
    navigate('/admin/dashboard/categories')
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    setLoadingSpinner(true)
    try {
      const categoryData = { title, slug }
      await addCategories(categoryData)
      setShowModalSuccess(true)
      setTimeout(() => {
        navigate('/admin/dashboard/categories')
      }, 2000)
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
      {showModalSuccess ? <ModalSuccess msg={msgSuccess} close={() => setShowModalSuccess(false)} /> :
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[70] outline-none focus:outline-none">
            <div className="relative w-1/3 my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between px-6 py-5 border-b border-solid border-zinc-200 rounded-t">
                  <h3 className="font-semibold text-base md:text-lg text-textPrimary">
                    Tambah Kategori
                  </h3>
                </div>
                {/*body*/}
                <div className="p-6">

                  <form onSubmit={handleAddCategory} className="w-full max-w-lg" action='#'>

                    {msgErrors && (<AlertErrors msg={msgErrors} close={clearError} />)}

                    <div className='mb-2'>
                      <div>
                        <label className="mb-2 text-sm font-bold text-textPrimary">Title</label>
                        <input type="text" name="title" placeholder="Nama kategori"
                          className="bg-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5" value={title} onChange={handleChangeTitle} />
                      </div>
                    </div>
                    <div>
                      <label
                        className="mb-2 text-sm font-bold text-textPrimary">Slug</label>
                      <input type="text" name="slug" placeholder="slug"
                        className="bg-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5" value={slug} onChange={handleChangeSlug} />
                    </div>

                    <button type="submit"
                      className="w-full font-medium text-textPrimary hover:text-white hover:bg-hoverBgButton border border-borderButton focus:ring-2 focus:outline-none focus:ring-ringFocusBtn rounded-lg text-sm px-5 py-2.5 text-center mt-5">Tambah</button>
                  </form>

                </div>

                {/*footer*/}
                <div className="flex items-center justify-end p-3 border-t border-solid border-zinc-200 rounded-b">
                  <button onClick={handleCloseModalAdd}
                    className="text-textPrimary font-medium rounded-lg text-sm px-4 py-2 hover:text-red-600"
                    type="button"
                  >
                    close
                  </button>
                </div>

              </div>
            </div>
          </div>
          <div className="opacity-40 fixed inset-0 z-[60] bg-black"></div>
        </>
      }
    </>
  )
}

export default AddCategory
