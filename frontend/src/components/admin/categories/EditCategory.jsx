import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { CategoriesContext } from './CategoriesContext'
import AlertErrors from '../../Layouts/AlertErrors'
import ModalSuccess from '../../Layouts/ModalSuccess'
import LoadingSpinner from '../../Layouts/Loading'

const EditCategory = () => {

  const { getCategoryById, editCategory, msgErrors, clearError, msgSuccess } = useContext(CategoriesContext)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [oldTitle, setOldTitle] = useState('')
  const [oldSlug, setOldSlug] = useState('')
  const [showModalSuccess, setShowModalSuccess] = useState(false)
  const [loadingSpinner, setLoadingSpinner] = useState(false)

  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {

    const fetchCategoryById = async () => {
      try {
        const response = await getCategoryById(params.id)
        setTitle(response.title)
        setOldTitle(response.title)
        setSlug(response.slug)
        setOldSlug(response.slug)
      } catch (error) {
        console.log(error)
      }
    }
    fetchCategoryById()
  }, [])

  const handleChangeTitle = (e) => {
    const value = e.target.value
    setTitle(value)
    const newSlug = value.toLowerCase().replace(/\s+/g, "-")
    setSlug(newSlug)
    clearError()
  }

  const handleChangeSlug = (e) => {
    const value = e.target.value
    const newSlug = value.toLowerCase().replace(/\s+/g, '-')
    setSlug(newSlug)
    clearError()
  }

  const handleEditCategory = async (e) => {
    e.preventDefault()
    setLoadingSpinner(true)
    try {
      const categoryData = { title, oldTitle, slug, oldSlug }
      await editCategory(params.id, categoryData)
      setShowModalSuccess(true)
      setTimeout(() => {
        navigate('/admin/dashboard/categories')
      }, 2000)
    } catch (error) {
      return
    } finally {
      setLoadingSpinner(false)
    }
  }

  return (
    <>
      {loadingSpinner ? <LoadingSpinner /> : null}
      {showModalSuccess ? <ModalSuccess msg={msgSuccess} close={() => setShowModalSuccess(false)} /> : null}
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[70] outline-none focus:outline-none">
        <div className="relative w-1/3 my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between px-6 py-5 border-b border-solid border-zinc-200 rounded-t">
              <h3 className="font-semibold text-base md:text-lg text-textPrimary">
                Edit Kategori
              </h3>
            </div>
            {/*body*/}
            <div className="p-6">

              <form onSubmit={handleEditCategory} className="w-full max-w-lg" action='#'>

                {msgErrors && (<AlertErrors msg={msgErrors} close={clearError} />)}

                <div className='mb-2'>
                  <label
                    className="mb-2 text-sm font-bold text-textPrimary">Title</label>
                  <input type="text" name="title" placeholder="nama kategori"
                    className="bg-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5" value={title} onChange={handleChangeTitle} />
                  <input type='hidden' value={oldTitle} readOnly />
                </div>
                <div>
                  <label className="mb-2 text-sm font-bold text-textPrimary">Slug</label>
                  <input type="text" name="slug" placeholder="slug" className="bg-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5" value={slug} onChange={handleChangeSlug} />
                  <input type='hidden' value={oldSlug} readOnly />
                </div>
                <button type="submit" className="w-full font-medium text-textPrimary hover:text-white hover:bg-hoverBgButton border border-borderButton focus:ring-2 focus:outline-none focus:ring-ringFocusBtn rounded-lg text-sm px-5 py-2.5 text-center mt-5">Edit</button>
              </form>
            </div>

            {/*footer*/}
            <div className="flex items-center justify-end p-3 border-t border-solid border-zinc-200 rounded-b">
              <Link to='/admin/dashboard/categories' className="text-textPrimary font-medium rounded-lg text-sm px-4 py-2 hover:text-red-600" type="button">tutup</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-40 fixed inset-0 z-[60] bg-black"></div>
    </>
  )
}

export default EditCategory
