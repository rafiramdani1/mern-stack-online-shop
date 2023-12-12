import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useDeleteProductMutation, useGetProductsQuery } from '../../../features/products/productsApiSlice'
import LoadingSpinner from '../../layouts/LoadingSpinner'
import ModalDelete from '../../layouts/ModalDelete'
import ModalSuccess from '../../layouts/ModalSuccess'

const Products = () => {

  // use get products
  const { data: products, isLoading, refetch } = useGetProductsQuery()

  // locale state
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [idProduct, setIdProduct] = useState(null)
  const [msgSuccess, setMsgSuccess] = useState('')

  // handle click delete
  const handleClickDelete = idProduct => {
    setIdProduct(idProduct)
    setShowModalDelete(true)
  }

  // use delete product
  const [deleteProduct, { isLoading: loadingDeleteProduct, isSuccess, reset }] = useDeleteProductMutation()

  // handle confirm delete product
  const handleDeleteProduct = async event => {
    event.preventDefault()
    try {
      const response = await deleteProduct(idProduct)
      setMsgSuccess(response.data.msg)
      // call refetch data
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
      {loadingDeleteProduct ? <LoadingSpinner /> : null}

      {showModalDelete ? <ModalDelete onConfirmDelete={handleDeleteProduct} onCancelDelete={() => setShowModalDelete(false)} /> : null}

      {isSuccess && msgSuccess !== '' ? <ModalSuccess msg={msgSuccess} close={reset} /> : null}

      <div className="w-full px-2">

        <Link to={'/admin/dashboard/products/add-product'} className='block max-w-fit text-textPrimary hover:text-white border border-borderButton hover:bg-hoverBgButton focus:ring-2 focus:outline-none focus:ring-ringFocusBtn font-medium rounded-lg text-xs md:text-sm px-5 py-2.5 text-center mr-2 mb-3'>Tambah Produk</Link>

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
                  Gambar
                </th>
                <th scope="col" className="px-4 py-3">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product, i) => (
                <tr className="bg-white border-b" key={product._id}>
                  <td className='px-4 py-4 text-center'>{i + 1}</td>
                  <td className='px-4 py-4'>{product.title}</td>
                  <td className='px-4 py-4'>{product.id_category.title}</td>
                  <td className='px-4 py-4'>
                    <img src={product.url} className='w-28 h-24' />
                  </td>
                  <td className='px-4 py-4'>
                    <Link to={`/admin/dashboard/products/detail/${product._id}`} className='mx-1 font-semibold hover:text-cyan-500'>Detail</Link>
                    {/* <Link to={`/admin/dashboard/products/edit?id=${product._id}&subcate=${product.id_sub_category.id_category}`} className='mx-1 font-semibold hover:text-cyan-500'>Edit</Link> */}
                    <Link to={`/admin/dashboard/products/edit/${product._id}`} className='mx-1 font-semibold hover:text-cyan-500'>Edit</Link>
                    <button onClick={() => handleClickDelete(product._id)} className='mx-1 font-semibold hover:text-red-600'>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* if products data not found */}
        {products?.length <= 0 ?
          (<h1 className='w-full text-center relative text-slate-600 font-normal text-base mt-3 mb-3'>Tidak ada data ditemukan</h1>)
          : null}

      </div>
      <Outlet />
    </>
  )
}

export default Products
