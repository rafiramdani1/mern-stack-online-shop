import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AlertErrors from '../../layouts/AlertErrors'
import ModalSuccess from '../../layouts/ModalSuccess'
import LoadingSpinner from '../../layouts/Loading'
import { CategoriesContext } from '../categories/CategoriesContext'
import { SubCategoriesContext } from './SubCategoriesContext'

const EditSubCategory = () => {

  const { categories } = useContext(CategoriesContext)
  const { getSubCategoryById, editSubCategory, msgSuccess, msgError, clearError } = useContext(SubCategoriesContext)

  // STATE FORM
  const [subCategory, setSubCategory] = useState('')
  const [oldSubCategory, setOldSubCategory] = useState('')
  const [slug, setSlug] = useState('')
  const [oldSlug, setOldSlug] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [modalSuccessEdit, setModalSuccessEdit] = useState(false)
  const [loadingSpinner, setLoadingSpinner] = useState(false)
  const navigate = useNavigate()
  const params = useParams()

  useEffect(() => {
    const fetchSubCategoryById = async () => {
      try {
        const response = await getSubCategoryById(params.id)
        setSubCategory(response.title)
        setOldSubCategory(response.title)
        setSlug(response.slug)
        setOldSlug(response.slug)
        setCategoryId(response.id_category._id)
      } catch (error) {
        console.log(error)
      }
    }
    fetchSubCategoryById()
  }, [])

  const handleChangeSubCategory = (e) => {
    const value = e.target.value
    setSubCategory(value)
    const newSlug = value.toLowerCase().replace(/\s+/g, '-')
    setSlug(newSlug)
    clearError()
  }

  const handleChangeSlug = (e) => {
    const value = e.target.value
    const newSlug = value.toLowerCase().replace(/\s+/g, '-')
    setSlug(newSlug)
    clearError()
  }

  const handleChangeCategory = (e) => {
    const value = e.target.value
    setCategoryId(value)
    clearError()
  }

  const handleEditSubCategory = async (e) => {
    e.preventDefault()
    setLoadingSpinner(true)
    try {
      const id = params.id
      const data = { subCategory, oldSubCategory, slug, oldSlug, categoryId }
      await editSubCategory(id, data)
      setModalSuccessEdit(true)
      setTimeout(() => {
        navigate('/admin/dashboard/sub-categories')
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
      <>
        {modalSuccessEdit ? <ModalSuccess msg={msgSuccess} close={() => setModalSuccessEdit(false)} /> :
          <>
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

                    <form onSubmit={handleEditSubCategory} className="w-full max-w-lg" action='#'>

                      {msgError && (<AlertErrors msg={msgError} close={clearError} />)}

                      <div className='mb-2'>
                        <label
                          className="mb-2 text-sm font-bold text-textPrimary">Sub Kategori</label>
                        <input type="text" name="title" placeholder="Sub kategori"
                          className="bg-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5" value={subCategory} onChange={handleChangeSubCategory} />
                        <input type='hidden' value={subCategory} readOnly />
                      </div>

                      <div>
                        <label
                          className="mb-2 text-sm font-bold text-textPrimary">Slug</label>
                        <input type="text" name="slug" placeholder="slug"
                          className="bg-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5" value={slug} onChange={handleChangeSlug} />
                        <input type='hidden' value={slug} readOnly />
                      </div>

                      <div className='mt-2'>
                        <div className='relative'>
                          <label className="mb-2 text-sm font-bold text-textPrimary">Kategori</label>
                          <select className='block appearance-none w-1/2 text-sm text-textPrimary bg-bgInput border border-borderInput py-2.5 px-4 pr-8 leading-tight focus:outline-none rounded-lg focus:bg-white focus:border-zinc-500' value={categoryId} onChange={handleChangeCategory}>
                            <option value=''>Pilih Kategori</option>
                            {categories.map(category => (
                              <option key={category._id} value={category._id}>{category.title}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 flex items-center px-2 text-textPrimary left-40 mt-7">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                          </div>
                        </div>
                      </div>

                      <button type="submit"
                        className="w-full font-medium text-textPrimary hover:text-white hover:bg-hoverBgButton border border-borderButton focus:ring-2 focus:outline-none focus:ring-ringFocusBtn rounded-lg text-sm px-5 py-2.5 text-center mt-5">Edit</button>
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
        }
      </>
    </>
  )
}

export default EditSubCategory
