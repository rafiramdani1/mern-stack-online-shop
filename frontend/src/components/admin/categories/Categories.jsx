import axios from 'axios'
import React, { useEffect, useState, useContext } from 'react'
import jwtDecode from 'jwt-decode'
import { useNavigate, Link } from 'react-router-dom'
import NavbarAdmin from '../NavbarAdmin'
import { CategoriesContext, CategoriesProvider } from './CategoriesContext'
import LoadingSpinner from '../../Layouts/Loading'
import ModalDelete from '../../layouts/ModalDelete'
import ModalSuccess from '../../layouts/ModalSuccess'

const Categories = () => {
  const { getCategories, categories, deleteCategory, msgSuccess } = useContext(CategoriesContext)
  const [expired, setExpired] = useState('')
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [loadingSpinner, setLoadingSpinner] = useState(false)
  const [idCategoryDelete, setIdCategoryDelete] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    refreshToken()
    getCategories()
  }, [])

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:3001/auth/token')
      const decoded = jwtDecode(response.data.accessToken)
      if (decoded.role !== 'admin') return navigate('/')
      setExpired(decoded.exp)
    } catch (error) {
      if (error.response) {
        navigate('/')
      }
    }
  }

  // refresh token
  const axiosRefresh = axios.create()
  axiosRefresh.interceptors.request.use(async (config) => {
    const currentDate = new Date()
    if (expired * 1000 < currentDate.getTime()) {
      const response = await axios.get('http://localhost:3001/auth/token')
      config.headers.Authorization = `Bearer ${response.data.accessToken}`
      const decoded = jwtDecode(response.data.accessToken)
      if (decoded.role !== 'admin') return navigate('/')
      setExpired(decoded.exp)
    }
    return config
  }, (error) => {
    return Promise.reject(error)
  })

  const handleDeleteClick = id => {
    setIdCategoryDelete(id)
    setShowModalDelete(true)
  }

  const handleCloseModalDelete = () => {
    setIdCategoryDelete(null)
    setShowModalDelete(false)
  }

  const handleDeleteCategory = async (e) => {
    e.preventDefault()
    setLoadingSpinner(true)
    setShowModalDelete(false)
    try {
      await deleteCategory(idCategoryDelete)
    } catch (error) {
      console.log(error)
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
      {showModalDelete ? <ModalDelete onConfirmDelete={handleDeleteCategory} onCancelDelete={handleCloseModalDelete} /> : null}
      <NavbarAdmin />
      <section id="category" className="p-4 sm:ml-64 mt-20">
        <div className="container">
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
                  {categories.map((category, i) => (
                    <tr className="bg-white border-b" key={category._id}>
                      <td className='px-6 py-4 text-sm'>{i + 1}</td>
                      <td className='px-6 py-4 text-sm'>{category.title}</td>
                      <td className='px-6 py-4 text-sm'>{category.slug}</td>
                      <td className='px-6 py-4 text-base'>
                        <Link to={`/admin/dashboard/categories/edit/${category._id}`} className='mx-1 font-semibold hover:text-cyan-500'><i className="uil uil-edit text-cyan-500 hover:text-cyan-700"></i></Link>
                        <a onClick={() => handleDeleteClick(category._id)} className='mx-1 font-semibold   cursor-pointer'><i className="uil uil-trash-alt text-red-500 hover:text-red-700"></i></a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* {noFoundData && ( */}
            {/* <h1 className='text-center w-full relative text-slate-600 font-normal text-base mt-3 mb-3'>Tidak ada data ditemukan</h1> */}
            {/* )} */}
          </div>
        </div>
      </section>
    </>
  )
}

export default Categories
