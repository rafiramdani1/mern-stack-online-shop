import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useDeleteSubCategoryMutation, useGetSubCategoriesQuery } from '../../../features/sub-categories/subCategoryApiSlice'
import { useGetCategoriesQuery } from '../../../features/categories/categoriesApiSlice'
import ModalDelete from '../../layouts/ModalDelete'
import ModalSuccess from '../../layouts/ModalSuccess'
import LoadingSpinner from '../../layouts/LoadingSpinner'

const SubCategories = () => {

  // locale state
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [idSubCategory, setIdSubCategory] = useState(null)
  const [msgSuccess, setMsgSuccess] = useState('')

  // use get sub categories
  const { data: subCategories, isLoading: loadingGetSubCategory, refetch } = useGetSubCategoriesQuery()

  // use get categories
  const { data: categories } = useGetCategoriesQuery()

  const handleDeleteClick = idSubCategory => {
    setIdSubCategory(idSubCategory)
    setShowModalDelete(true)
  }

  const [deleteSubCategory, { isLoading: loadingDeleteSubCategory, isSuccess, reset }] = useDeleteSubCategoryMutation()

  // handle delete sub category
  const handleDeleteSubCategory = async (e) => {
    e.preventDefault()
    try {
      const response = await deleteSubCategory(idSubCategory)
      setMsgSuccess(response.data.msg)
      // call refetch sub categories data
      await refetch()

      setShowModalDelete(false)
      // close modal success
      setTimeout(() => {
        setMsgSuccess('')
        reset()
      }, 2000)
    } catch (error) {
      return
    }
  }

  return (
    <>
      {loadingDeleteSubCategory ? <LoadingSpinner /> : null}

      {showModalDelete ? <ModalDelete onConfirmDelete={handleDeleteSubCategory} onCancelDelete={() => setShowModalDelete(false)} /> : null}

      {isSuccess && msgSuccess !== '' ? <ModalSuccess msg={msgSuccess} close={reset} /> : null}

      <div className="w-full px-2">

        <Link
          to={'/admin/dashboard/sub-categories/add-sub-category'} className='block max-w-fit text-textPrimary hover:text-white border border-borderButton hover:bg-hoverBgButton focus:ring-2 focus:outline-none focus:ring-ringFocusBtn font-medium rounded-lg text-xs md:text-sm px-5 py-2.5 text-center mr-2 mb-3'>Tambah Sub Kategori</Link>

        <div className='w-full'>
          <div className='justify-end flex mb-3'>
            <div className='relative'>
              <label className="block mb-1 text-textPrimary text-xs font-normal">Filter By Kategori</label>
              <select className='block appearance-none w-fit text-xs text-textPrimary bg-bgInput border border-borderInput py-2 px-4 pr-8 leading-tight focus:outline-none rounded-lg focus:bg-white focus:border-zinc-500'>
                <option>Pilih Kategori</option>
                {categories?.map(category => (
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
                {subCategories?.map((subCategory, i) => (
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

        {/* if categories data not found */}
        {subCategories?.length <= 0 ?
          (<h1 className='w-full text-center relative text-slate-600 font-normal text-base mt-3 mb-3'>Tidak ada data ditemukan</h1>)
          : null}

      </div>
      <Outlet />
    </>

  )
}

export default SubCategories
