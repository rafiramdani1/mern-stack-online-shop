import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import DOMPurify from 'dompurify'
import ModalSuccess from '../../../layouts/ModalSuccess'
import ModalDelete from '../../../layouts/ModalDelete'
import LoadingSpinner from '../../../layouts/Loading'
import { ProductsContext } from '../ProductsContext'
import ListSizeProduct from './ListSizeProduct'
import AddSizeProduct from './AddSizeProduct'
import EditSizeProduct from './EditSizeProduct'

const sanitazeHTML = (html) => { return DOMPurify.sanitize(html) }

const DetailProduct = () => {

  const { getProductById } = useContext(ProductsContext)

  const [title, setTitle] = useState('')
  const [image, setImage] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [sizeProduct, setSizeProduct] = useState([])
  const [category, setCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [success, setSuccess] = useState('')
  const [modalSuccess, setModalSuccess] = useState(false)
  const [loadingSpinner, setLoadingSpinner] = useState(false)

  const [modalAdd, setModalAdd] = useState(false)
  const [modalEdit, setModalEdit] = useState(false)
  const [modalDelete, setModalDelete] = useState(false)
  const [idSelectDeleted, setIdSelectedDeleted] = useState(null)
  const [idSizeProduct, setIdSizeProduct] = useState('')

  const param = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    fetchProductById()
  }, [])

  const fetchProductById = async () => {
    try {
      const response = await getProductById(param.id)
      const sanitizedData = sanitazeHTML(response.product.description)
      setTitle(response.product.title)
      setImage(response.product.url)
      setPrice(response.product.price)
      setDescription(sanitizedData)
      setSizeProduct(response.sizeProduct)
      setCategory(response.product.id_category.title)
      setSubCategory(response.product.id_sub_category.title)
    } catch (error) {
      if (error.response) {
        navigate('/admin/dashboard/products')
      }
    }
  }

  const handleAddSizeProduct = async () => {
    setTimeout(() => setModalAdd(false), 2000)
    await fetchProductById()
  }

  const openModalEdit = (e) => {
    setIdSizeProduct(e)
    setModalEdit(true)
  }

  const handleEditSizeProduct = async () => {
    setTimeout(() => setModalEdit(false), 2000);
    await fetchProductById()
  }

  const handleOpenModalDelete = e => {
    setIdSelectedDeleted(e)
    setModalDelete(true)
  }

  const handleDeleteSizeProduct = async (e) => {
    e.preventDefault()
    setLoadingSpinner(true)
    setModalDelete(false)
    try {
      const response = await axios.delete(`http://localhost:3001/products/delete/size/${idSelectDeleted}`)
      setSuccess(response.data.msg)
      fetchProductById()
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
      {modalAdd ? <AddSizeProduct close={() => setModalAdd(false)} onProductSizeAdded={handleAddSizeProduct} /> : null}
      {modalEdit ? <EditSizeProduct idSizeProduct={idSizeProduct} onSizeProductEdit={handleEditSizeProduct} closeModal={() => setModalEdit(false)} /> : null}
      {modalDelete ? <ModalDelete onConfirmDelete={handleDeleteSizeProduct} onCancelDelete={() => setModalDelete(false)} /> : null}

      <section className='p-4 sm:ml-64 mt-20 mb-48' >
        <div className='flex w-full mb-10'>
          <div className='w-1/3 justify-start ml-16'>
            <div className=''>
              <img className='w-72 h-72' src={image} alt='product image' />
            </div>
          </div>
          <div className='w-1/2 p-2'>
            <div className=''>
              <h3 className='text-lg font-bold text-slate-700'>{title}</h3>
              <div>
                <h2 className='text-2xl mt-2 font-bold text-slate-700'>Rp. {price}</h2>
              </div>
            </div>
            <div className='border-b mt-2 border-slate-200'></div>
            <div className='mt-2'>
              <h2 className='text-slate-700 text-base font-medium'>Pilih ukuran sepatu :</h2>
              <div className='flex mt-2'>
                {sizeProduct.map(size => (
                  <div key={size._id}>
                    <div className='mr-1'>
                      <button type='button' className='border px-2 py-1 rounded-sm text-slate-800 font-medium text-sm shadow-sm hover:bg-cyan-500 hover:ring-1 hover:text-white'>{size.size}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className='border-b mt-2 border-slate-200'></div>
            <div className='mt-2'>
              <h2 className='text-slate-700 font-medium text-base'>Deskripsi</h2>
              <div className='mt-2 text-slate-800 text-sm font-normal' dangerouslySetInnerHTML={{ __html: description }} />
            </div>
            <div className='mt-2'>
              <h2 className='text-slate-700 font-normal text-sm'><strong>Kategori :</strong>
                <Link to='#' className='text-textSecondary hover:text-textPrimary'> {category}</Link>,
                <Link to='#' className='text-textSecondary hover:text-textPrimary'> {subCategory}</Link>
              </h2>
            </div>
          </div>
        </div>

        <button onClick={() => setModalAdd(true)} className='block max-w-fit text-textPrimary hover:text-white border border-borderButton hover:bg-hoverBgButton focus:ring-2 focus:outline-none focus:ring-ringFocusBtn font-medium rounded-lg text-xs md:text-sm px-5 py-2.5 text-center ml-16 mb-3'>Tambah Ukuran Produk</button>
        {<ListSizeProduct sizeProduct={sizeProduct} openModalEdit={openModalEdit} openModalDelete={handleOpenModalDelete} />}
        {/* <ListSizeProduct sizeProduct={sizeProduct} openModalEdit={openModalEdit} openModalDelete={handleOpenModalDelete} onDeleteSizeProduct={handleDeleteSizeProduct} /> */}
      </section>
    </>
  )
}

export default DetailProduct
