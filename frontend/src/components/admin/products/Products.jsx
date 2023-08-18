import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NavbarAdmin from '../NavbarAdmin'
import { ProductsContext } from './ProductsContext'
import ModalDelete from '../../layouts/ModalDelete'
import axios from 'axios'
import ModalSuccess from '../../layouts/ModalSuccess'
import LoadingSpinner from '../../Layouts/Loading'

const Products = () => {
  const { getProducts, products } = useContext(ProductsContext)

  const [modalDelete, setModalDelete] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [success, setSuccess] = useState('')
  const [loadingSpinner, setLoadingSpinner] = useState(false)
  const [idSelectDeleted, setIdSelectedDeleted] = useState('')

  useEffect(() => {
    getProducts()
  }, [])

  const handleOpenModalDelete = e => {
    setIdSelectedDeleted(e)
    setModalDelete(true)
  }

  const handleDeleteProduct = async (e) => {
    e.preventDefault()
    setLoadingSpinner(true)
    setModalDelete(false)
    try {
      const response = await axios.delete(`http://localhost:3001/products/delete/${idSelectDeleted}`)
      setSuccess(response.data.msg)
      getProducts()
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingSpinner(false)
      setModalSuccess(true)
      setTimeout(() => {
        setModalSuccess(false)
      }, 2000);
    }
  }

  return (
    <>
      {loadingSpinner ? <LoadingSpinner /> : null}
      {modalSuccess ? <ModalSuccess msg={success} close={() => setModalSuccess(false)} /> : null}
      {modalDelete ? <ModalDelete onConfirmDelete={handleDeleteProduct} onCancelDelete={() => setModalDelete(false)} /> : null}
      <NavbarAdmin />
      <section id="products" className="p-4 sm:ml-64 mt-20">
        <div className="container">
          <div className="w-full px-2">

            <Link to={'/admin/dashboard/products/add-products'} className='block max-w-fit text-textPrimary hover:text-white border border-borderButton hover:bg-hoverBgButton focus:ring-2 focus:outline-none focus:ring-ringFocusBtn font-medium rounded-lg text-xs md:text-sm px-5 py-2.5 text-center mr-2 mb-3'>Tambah Produk</Link>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-textContentTable">
                <thead className="text-xs text-textHeadTable uppercase bg-bgTable">
                  <tr className='bg-zinc-200'>
                    <th scope="col" className="px-4 py-3 w-6">
                      No
                    </th>
                    <th scope="col" className="px-4 py-3 w-52">
                      Title
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Kategori
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Sub Kategori
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Gambar
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, i) => (
                    <tr className="bg-white border-b" key={product._id}>
                      <td className='px-4 py-4 text-center'>{i + 1}</td>
                      <td className='px-4 py-4'>{product.title}</td>
                      <td className='px-4 py-4'>{product.id_category.title}</td>
                      <td className='px-4 py-4'>{product.id_sub_category.title}</td>
                      <td className='px-4 py-4'>
                        <img src={product.url} className='w-28 h-24' />
                      </td>
                      <td className='px-4 py-4'>
                        <Link to={`/admin/dashboard/products/detail/${product._id}`} className='mx-1 font-semibold hover:text-cyan-500'>Detail</Link>
                        <Link to={`/admin/dashboard/products/edit?id=${product._id}&subcate=${product.id_sub_category.id_category}`} className='mx-1 font-semibold hover:text-cyan-500'>Edit</Link>
                        <button onClick={() => handleOpenModalDelete(product._id)} className='mx-1 font-semibold hover:text-red-600'>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Products
