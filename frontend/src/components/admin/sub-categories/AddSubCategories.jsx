import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ModalSuccess from '../../layouts/ModalSuccess'
import LoadingSpinner from '../../layouts/Loading'
import AlertErrors from '../../layouts/AlertErrors'
import { CategoriesContext } from '../categories/CategoriesContext'
import { SubCategoriesContext } from './SubCategoriesContext'

const AddSubCategories = () => {

  const { getCategories, categories } = useContext(CategoriesContext)
  const { addSubCategory, msgError, msgSuccess, clearError } = useContext(SubCategoriesContext)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [modalSuccessAdd, setModalSuccessAdd] = useState(false)
  const [loadingSpinner, setLoadingSpinner] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getCategories()
  }, [])

  const handleChangeTitle = (e) => {
    const value = e.target.value
    setTitle(value)
    const newSlug = value.toLowerCase().replace(/\s+/g, "-") // replace spasi
    setSlug(newSlug)
    clearError()
  }

  const handleChangeSlug = (e) => {
    const value = e.target.value
    const newSlug = value.toLowerCase().replace(/\s+/g, '-')
    setSlug(newSlug)
    clearError()
  }

  const handleChangeCategoryId = (e) => {
    const value = e.target.value
    setCategoryId(value)
    clearError()
  }

  const handleAddSubCategory = async (e) => {
    e.preventDefault()
    setLoadingSpinner(true)
    try {
      const data = { title, slug, categoryId }
      await addSubCategory(data)
      setModalSuccessAdd(true)
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
      {modalSuccessAdd ? <ModalSuccess msg={msgSuccess} close={() => setModalSuccessAdd(false)} /> :
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
                    Tambah Sub Kategori
                  </h3>
                </div>
                {/*body*/}
                <div className="p-6">

                  <form onSubmit={handleAddSubCategory} className="w-full max-w-lg" action='#'>

                    {msgError && (<AlertErrors msg={msgError} close={clearError} />)}

                    <div className='mb-2'>
                      <div>
                        <label className="mb-2 text-sm font-bold text-textPrimary">Title</label>
                        <input type="text" name="title" placeholder="Nama kategori"
                          className="g-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5" value={title} onChange={handleChangeTitle}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        className="mb-2 text-sm font-bold text-textPrimary">Slug</label>
                      <input type="text" name="slug" placeholder="slug"
                        className="g-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5" value={slug} onChange={handleChangeSlug}
                      />
                    </div>
                    <div className='mt-2'>
                      <div className='relative'>
                        <label className="mb-2 text-sm font-bold text-textPrimary">Kategori</label>
                        <select className='block appearance-none w-1/2 text-sm text-textPrimary bg-bgInput border border-borderInput py-2.5 px-4 pr-8 leading-tight focus:outline-none rounded-lg focus:bg-white focus:border-focusBorderInput' value={categoryId} onChange={handleChangeCategoryId}>
                          <option>Pilih Kategori</option>
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
                      className="w-full font-medium text-textPrimary hover:text-white hover:bg-hoverBgButton border border-borderButton focus:ring-2 focus:outline-none focus:ring-ringFocusBtn rounded-lg text-sm px-5 py-2.5 text-center mt-5">Tambah</button>
                  </form>

                </div>

                {/*footer*/}
                <div className="flex items-center justify-end p-3 border-t border-solid border-zinc-200 rounded-b">
                  <Link to='/admin/dashboard/sub-categories'
                    className="text-textPrimary font-medium rounded-lg text-sm px-4 py-2 hover:text-red-600"
                    type="button"
                  >
                    Close
                  </Link>
                </div>

              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-[60] bg-black"></div>
        </>
      }
    </>

  )
}

export default AddSubCategories
