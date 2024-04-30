import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { useGetProductByIdQuery } from '../../../../features/products/productsApiSlice'
import AddSizeProduct from './AddSizeProduct'
import ListSizeProduct from './ListSizeProduct'
import EditSizeProduct from './EditSizeProduct'
import ModalDelete from '../../../layouts/ModalDelete'
import { useDeleteSizeProductByIdMutation } from '../../../../features/products/productsApiSlice'
import LoadingSpinner from '../../../layouts/LoadingSpinner'
import ModalSuccess from '../../../layouts/ModalSuccess'
import { IoMdAdd } from "react-icons/io";

const sanitazeHTML = (html) => { return DOMPurify.sanitize(html) }

const DetailProduct = () => {

  // get param
  const { id: idProduct } = useParams()

  // use get product by id
  const { data: productById, isLoading, status, refetch } = useGetProductByIdQuery(idProduct)

  const [msgSuccess, setMsgSuccess] = useState('')
  const [modalAddSize, setModalAddSize] = useState(false)
  const [modalEdit, setModalEdit] = useState(false)
  const [modalDelete, setModalDelete] = useState(false)
  const [idSelectDeleted, setIdSelectedDeleted] = useState(null)
  const [idSizeProduct, setIdSizeProduct] = useState('')


  const openModalEdit = (e) => {
    setIdSizeProduct(e)
    setModalEdit(true)
  }

  const handleOpenModalDelete = e => {
    setIdSelectedDeleted(e)
    setModalDelete(true)
  }

  const [deleteSizeProduct, { isLoading: loadingDelete, isSuccess, reset }] = useDeleteSizeProductByIdMutation()

  const handleDeleteSizeProduct = async (e) => {
    e.preventDefault()
    setModalDelete(false)
    try {
      const response = await deleteSizeProduct(idSelectDeleted)
      setMsgSuccess(response.data.msg)
      await refetch()

      setTimeout(() => {
        setMsgSuccess('')
        reset()
      }, 2000);
    } catch (error) {
      return
    }
  }

  return (
    <>
      {isLoading || status === 'pending' ? <LoadingSpinner /> : null}

      {loadingDelete ? <LoadingSpinner /> : null}

      {isSuccess && msgSuccess !== '' ? <ModalSuccess msg={msgSuccess} close={reset} /> : null}

      {modalAddSize ? <AddSizeProduct close={() => setModalAddSize(false)} /> : null}

      {modalEdit ? <EditSizeProduct idSizeProduct={idSizeProduct} closeModal={() => setModalEdit(false)} /> : null}

      {modalDelete ? <ModalDelete onConfirmDelete={handleDeleteSizeProduct} onCancelDelete={() => setModalDelete(false)} /> : null}

      <div className='flex w-full mb-10'>
        <div className='w-1/3 justify-start ml-16'>
          <div className=''>
            <img className='w-72 h-72' src={productById?.product.url} alt='product image' />
          </div>
        </div>
        <div className='w-1/2 p-2'>
          <div className=''>
            <h3 className='text-lg font-bold text-slate-700'>{productById?.product.title}</h3>
            <div>
              <h2 className='text-2xl mt-2 font-bold text-slate-700'>Rp. {productById?.product.price}</h2>
            </div>
          </div>
          <div className='border-b mt-2 border-slate-200'></div>
          <div className='mt-2'>
            <h2 className='text-slate-700 text-base font-medium'>Pilih ukuran sepatu :</h2>
            <div className='flex mt-2'>

              {productById?.sizeProduct?.length <= 0 ?
                <p className='text-xs tracking-tighter text-zinc-600'>-ukuran sepatu belum tersedia-</p>
                : (
                  productById?.sizesProduct?.map(size => (
                    <div key={size._id}>
                      <div className='mr-1'>
                        <button type='button' className='border px-2 py-1 rounded-sm text-slate-800 font-medium text-sm shadow-sm hover:bg-cyan-500 hover:ring-1 hover:text-white'>{size.size}</button>
                      </div>
                    </div>
                  ))
                )}

            </div>
          </div>
          <div className='border-b mt-2 border-slate-200'></div>
          <div className='mt-2'>
            <h2 className='text-slate-700 font-medium text-base'>Deskripsi</h2>
            <div className='mt-2 text-slate-800 text-sm font-normal' dangerouslySetInnerHTML={{ __html: sanitazeHTML(productById?.product.description) }} />
          </div>
          <div className='mt-2'>
            <h2 className='text-slate-700 font-normal text-sm'><strong>Kategori :</strong>
              <Link to='#' className='text-textSecondary hover:text-textPrimary'> {productById?.product.id_category.title}</Link>,
              <Link to='#' className='text-textSecondary hover:text-textPrimary'> {productById?.product.id_sub_category.title}</Link>
            </h2>
          </div>
        </div>
      </div>

      <button
        title='add size'
        onClick={() => setModalAddSize(true)}
        className='block max-w-fit text-textPrimary hover:text-white border border-borderButton hover:bg-hoverBgButton focus:ring-2 focus:outline-none focus:ring-ringFocusBtn font-medium rounded-lg text-xs md:text-sm px-5 py-2 text-center ml-16 mb-3'><IoMdAdd className='text-xl' /></button>

      {
        <ListSizeProduct
          sizeProduct={productById?.sizesProduct}
          openModalEdit={openModalEdit}
          openModalDelete={handleOpenModalDelete}
        />
      }

    </>
  )
}

export default DetailProduct
