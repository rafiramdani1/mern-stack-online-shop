import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import axios from 'axios'
import LoadingSpinner from '../../Layouts/Loading'
import AlertErrors from '../../Layouts/AlertErrors'
import ModalSuccess from '../../layouts/ModalSuccess'
import { CategoriesContext } from '../categories/CategoriesContext'
import { ProductsContext } from './ProductsContext'
import { SubCategoriesContext } from '../sub-categories/SubCategoriesContext'

const AddProducts = () => {

  const { getCategories, categories } = useContext(CategoriesContext)
  const { addProduct, msgSuccess, msgError, clearError } = useContext(ProductsContext)
  const { getSubCategoryByCategoryId } = useContext(SubCategoriesContext)

  useEffect(() => {
    getCategories()
  }, [])

  // state form       
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [file, setFile] = useState('')
  const [subCategoryId, setSubCategoryId] = useState('')
  const [loadingSpinner, setLoadingSpinner] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [imgPreview, setImgPreview] = useState('')
  const [showSubCategories, setShowSubCategories] = useState(false)
  const [optSubCate, setOptSubCate] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const navigate = useNavigate()

  const handleTitle = (e) => {
    const value = e.target.value
    setTitle(value)
    const newSlug = value.toLowerCase().replace(/\s+/g, '-')
    setSlug(newSlug)
    clearError()
  }

  const handleSlug = (e) => {
    const value = e.target.value
    const newSlug = value.toLowerCase().replace(/\s+/g, '-')
    setSlug(newSlug)
    clearError()
  }

  const handleDescription = (e, editor) => {
    setDescription(editor.getData())
    clearError()
  }

  const handleCategory = async (e) => {
    const value = e.target.value
    if (value === '') {
      setShowSubCategories(false)
    } else {
      setSelectedCategoryId(value)
      setShowSubCategories(true)
      try {
        const response = await getSubCategoryByCategoryId(value)
        setOptSubCate(response)
      } catch (error) {
        console.log(error)
      }
    }
    setCategory(value)
    clearError()
  }

  const handleChangeSubCategory = (e) => {
    const value = e.target.value
    setSubCategoryId(value)
    clearError()
  }

  const handlePrice = (e) => {
    const value = e.target.value
    setPrice(value)
    clearError()
  }

  const handleImageChange = e => {
    const value = e.target.files[0]
    setFile(value)
    setImgPreview(URL.createObjectURL(value))
    clearError()
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    setLoadingSpinner(true)
    try {
      const data = { title, slug, description, category, subCategoryId, price, file }
      await addProduct(data)
      setModalSuccess(true)
      setTimeout(() => {
        navigate('/admin/dashboard/products')
      }, 2000);
    } catch (error) {
      return
    } finally {
      setLoadingSpinner(false)
    }
  }

  return (
    <>
      {loadingSpinner ? <LoadingSpinner /> : null}
      {modalSuccess ? <ModalSuccess msg={msgSuccess} close={() => setModalSuccess(false)} /> : null}
      <section className='p-4 sm:ml-64 mt-20'>
        <div className="flex flex-col items-center justify-center px-2">
          <div className="w-full bg-white rounded-lg shadow">
            <div className="p-6 space-y-4">
              <h1 className="text-xl font-semibold leading-tight tracking-tight text-textPrimary">
                Tambah Produk
              </h1>
              <div className='border-b border-zinc-200'></div>
              <form onSubmit={handleAddProduct} className="space-y-4 md:space-y-6">

                {msgError && (<AlertErrors msg={msgError} close={clearError} />)}

                <div className='flex'>
                  <div className='w-1/2 mr-3'>
                    <div>
                      <label className="block mb-2 text-textPrimary text-sm font-semibold">Title</label>
                      <input type="title" name="title" id="title"
                        className="bg-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5"
                        placeholder="Title" value={title} onChange={handleTitle} />
                    </div>
                  </div>
                  <div className='w-1/2 mr-3'>
                    <div>
                      <label className="block mb-2 text-textPrimary text-sm font-semibold">Slug</label>
                      <input type="slug" name="slug" id="slug"
                        className="bg-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5"
                        placeholder="Slug" value={slug} onChange={handleSlug} />
                    </div>
                  </div>

                </div>
                <div className='flex'>
                  <div className='flex'>
                    <div className='relative mr-3'>
                      <label className="block mb-2 text-textPrimary text-sm font-semibold">Kategori</label>
                      <select className='block text-sm appearance-none w-40 bg-bgInput border border-borderInput text-textPrimary py-2 px-4 pr-8 leading-tight focus:outline-none rounded-lg focus:bg-white focus:border-zinc-500' onChange={handleCategory} value={category}>
                        <option value=''>Pilih Kategori</option>
                        {categories.map(cate => (
                          <option key={cate._id} value={cate._id}>{cate.title}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 flex items-center px-2 text-textPrimary left-32 mt-7">
                        <svg className="fillCurrent h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                      </div>
                    </div>
                    {!showSubCategories ? null :
                      <>
                        <div className='relative'>
                          <label className="block mb-2 text-textPrimary text-sm font-semibold">Sub Kategori</label>
                          <select className='block text-sm appearance-none w-40 bg-bgInput border border-borderInput text-textPrimary py-2 px-4 pr-8 leading-tight focus:outline-none rounded-lg focus:bg-white focus:border-zinc-500' value={subCategoryId} onChange={handleChangeSubCategory}>
                            <option value=''>Sub Kategori</option>
                            {optSubCate.map(subcate => (
                              <option key={subcate._id} value={subcate._id}>{subcate.title}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 flex items-center px-2 text-textPrimary left-32 mt-7">
                            <svg className="fillCurrent h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                          </div>
                        </div>
                      </>
                    }
                  </div>
                </div>
                <div className='block'>
                  <label
                    className="block mb-2 text-textPrimary text-sm font-semibold">Deskripsi</label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={description}
                    onChange={handleDescription}
                  />
                </div>
                <div className='flex'>
                  <div className='w-1/3 mr-3'>
                    <div>
                      <label className="block mb-2 text-textPrimary text-sm font-semibold">Harga</label>
                      <input type="price" name="price" id="price"
                        className="bg-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5"
                        placeholder="2.500.000" value={price} onChange={handlePrice} />
                    </div>
                  </div>
                </div>
                <div className='flex'>
                  <div className='w-1/3'>
                    <label className="block mb-2 text-textPrimary text-sm font-semibold">Gambar</label>
                    <input type='file' onChange={handleImageChange} />
                  </div>
                  <div className='w-1/3'>
                    {imgPreview ? (
                      <div>
                        <img src={imgPreview} alt='Preview' className='w-48 h-40' />
                      </div>
                    ) : ('')}
                  </div>
                </div>
                <button type="submit"
                  className="w-1/3 text-textPrimary hover:bg-hoverBgButton hover:text-white border border-borderButton focus:ring-2 focus:outline-none focus:ring-ringFocusBtn font-medium rounded-lg text-sm px-5 py-2.5 text-center">Tambah</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default AddProducts
