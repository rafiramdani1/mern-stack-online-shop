import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SubCategoriesContext } from './SubCategoriesContext'
import NavbarAdmin from '../NavbarAdmin'
import { CategoriesContext } from '../categories/CategoriesContext'
import LoadingSpinner from '../../Layouts/Loading'
import ModalDelete from '../../layouts/ModalDelete'
import ModalSuccess from '../../layouts/ModalSuccess'

const SubCategories = () => {

  const { getSubCategories, subCategories, deleteSubCategory, msgSuccess } = useContext(SubCategoriesContext)
  const { getCategories, categories } = useContext(CategoriesContext)
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [loadingSpinner, setLoadingSpinner] = useState(false)
  const [idSubCategoryDelete, setIdSubCategoryDelete] = useState('')

  useEffect(() => {
    getSubCategories()
    getCategories()
  }, [])

  const handleDeleteClick = (id) => {
    setIdSubCategoryDelete(id)
    setShowModalDelete(true)
  }

  const handleCloseModalDelete = () => {
    setIdSubCategoryDelete(null)
    setShowModalDelete(false)
  }

  const handleDeleteSubCategory = async (e) => {
    e.preventDefault()
    setLoadingSpinner(true)
    setShowModalDelete(false)
    try {
      await deleteSubCategory(idSubCategoryDelete)
    } catch (error) {
      return
    } finally {
      setLoadingSpinner(false)
      setModalSuccess(true)
      setTimeout(() => setModalSuccess(false), 2000)
    }
  }

  return (
    <>
      {loadingSpinner ? <LoadingSpinner /> : null}
      {modalSuccess ? <ModalSuccess msg={msgSuccess} close={() => setModalSuccess(false)} /> : null}
      {showModalDelete ? <ModalDelete onConfirmDelete={handleDeleteSubCategory} onCancelDelete={handleCloseModalDelete} /> : null}
      <NavbarAdmin />
      <section id="category" className="p-4 sm:ml-64 mt-20">
        <div className="container">
          <div className="w-full px-2">

            <Link to={'/admin/dashboard/sub-categories/add-sub-categories'} className='block max-w-fit text-textPrimary hover:text-white border border-borderButton hover:bg-hoverBgButton focus:ring-2 focus:outline-none focus:ring-ringFocusBtn font-medium rounded-lg text-xs md:text-sm px-5 py-2.5 text-center mr-2 mb-3'>Tambah Sub Kategori</Link>

            <div className='w-full'>
              <div className='justify-end flex mb-3'>
                <div className='relative'>
                  <label className="block mb-1 text-textPrimary text-xs font-normal">Filter By Kategori</label>
                  <select className='block appearance-none w-fit text-xs text-textPrimary bg-bgInput border border-borderInput py-2 px-4 pr-8 leading-tight focus:outline-none rounded-lg focus:bg-white focus:border-zinc-500'>
                    <option>Pilih Kategori</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>{category.title}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 flex items-center px-2 text-textPrimary right-0 mt-7">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                  </div>
                </div>
              </div>

              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-textContentTable">
                  <thead className="text-xs text-textHeadTable uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        No
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Sub Kategori
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Slug
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Kategori
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subCategories.map((subCategory, i) => (
                      <tr className="bg-bgTable border-b" key={subCategory._id}>
                        <td className='px-6 py-4 text-sm'>{i + 1}</td>
                        <td className='px-6 py-4 text-sm'>{subCategory.title}</td>
                        <td className='px-6 py-4 text-sm'>{subCategory.slug}</td>
                        <td className='px-6 py-4 text-sm'>{subCategory.id_category.title}</td>
                        <td className='px-6 py-4 text-base'>
                          <Link to={`/admin/dashboard/sub-categories/edit/${subCategory._id}`} className='mx-1 font-semibold hover:text-cyan-500'><i className="uil uil-edit text-cyan-500 hover:text-cyan-700"></i></Link>
                          <a onClick={() => handleDeleteClick(subCategory._id)} className='mx-1 font-semibold hover:text-red-600 cursor-pointer'><i className="uil uil-trash-alt text-red-500 hover:text-red-700"></i></a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* {noFoundData && (
              <h1 className='text-center w-full relative text-zinc-600 font-normal text-base mt-3 mb-3'>Tidak ada data ditemukan</h1>
            )} */}
          </div>
        </div>
      </section>
    </>
  )
}

export default SubCategories
