import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useDeleteCategoryMutation, useGetCategoriesQuery } from '../../../features/categories/categoriesApiSlice'
import ModalDelete from '../../layouts/ModalDelete'
import LoadingSpinner from '../../layouts/LoadingSpinner'
import ModalSuccess from '../../layouts/ModalSuccess'
import { useGetSubCategoriesQuery } from '../../../features/sub-categories/subCategoryApiSlice'

const Categories = () => {

  // use get categories
  const { data: categories, isLoading, refetch: refetchCategories } = useGetCategoriesQuery();
  // use get sub categories
  const { refetch: refetchSubCategories } = useGetSubCategoriesQuery()

  // local state
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [idCategory, setIdCategory] = useState(null)
  const [msgSuccess, setMsgSuccess] = useState('')

  const handleClickDelete = categoryId => {
    setIdCategory(categoryId)
    setShowModalDelete(true)
  }

  // use delete category
  const [deleteCategory, { isLoading: loadingDelete, isSuccess, reset }] = useDeleteCategoryMutation()

  // handle delete category
  const handleDeleteCategory = async event => {
    event.preventDefault()
    try {
      const response = await deleteCategory(idCategory)
      setMsgSuccess(response.data.msg)
      // call refetch data categories & sub categories
      await refetchCategories()
      await refetchSubCategories()

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

      {loadingDelete ? <LoadingSpinner /> : null}

      {showModalDelete ? <ModalDelete onConfirmDelete={handleDeleteCategory} onCancelDelete={() => setShowModalDelete(false)} /> : null}

      {isSuccess && msgSuccess !== '' ? <ModalSuccess msg={msgSuccess} close={reset} /> : null}

      <div className="w-full px-2">

        <Link to={'/admin/dashboard/categories/add-category'} className='block max-w-fit text-textPrimary hover:text-white border border-borderButton hover:bg-hoverBgButton focus:ring-2 focus:outline-none focus:ring-ringFocusBtn font-medium rounded-lg text-xs md:text-sm px-5 py-2.5 text-center mr-2 mb-3'>Tambah Kategori</Link>


        <div className="relative w-full overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-textContentTable">
            <thead className="text-xs text-textHeadTable uppercase bg-bgTable">
              <tr>
                <th scope="col" className="px-6 py-3">
                  No
                </th>
                <th scope="col" className="px-6 py-3">
                  Kategori
                </th>
                <th scope="col" className="px-6 py-3">
                  Slug
                </th>
                <th scope="col" className="px-6 py-3">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {
                categories?.map((category, i) => (
                  <tr className="bg-white border-b" key={category._id}>
                    <td className='px-6 py-4 text-sm'>{i + 1}</td>
                    <td className='px-6 py-4 text-sm'>{category.title}</td>
                    <td className='px-6 py-4 text-sm'>{category.slug}</td>
                    <td className='px-6 py-4 text-base'>
                      <Link to={`/admin/dashboard/categories/edit/${category._id}`} className='mx-1 font-semibold hover:text-cyan-500'><i className="uil uil-edit text-cyan-500 hover:text-cyan-700"></i></Link>
                      <a onClick={() => handleClickDelete(category._id)} className='mx-1 font-semibold  cursor-pointer'><i className="uil uil-trash-alt text-red-500 hover:text-red-700"></i></a>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

        {/* if categories data not found */}
        {categories?.length <= 0 ?
          (<h1 className='w-full text-center relative text-slate-600 font-normal text-base mt-3 mb-3'>Tidak ada data ditemukan</h1>)
          : null}

      </div>
      <Outlet />
    </>
  )
}

export default Categories