import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import DOMPurify from 'dompurify'
import jwtDecode from 'jwt-decode'
import ModalSuccess from '../layouts/ModalSuccess'
import AlertErrors from '../Layouts/AlertErrors'
import LoadingSpinner from '../Layouts/Loading'
import Header from '../Layouts/Header'
import { ProductsContext } from '../admin/products/ProductsContext'
import { CartsContext } from '../admin/CartsContext'

const sanitazeHTML = (html) => {
  return DOMPurify.sanitize(html)
}

const DetailProductUser = () => {

  const { getProductBySlug } = useContext(ProductsContext)
  const { addCarts, msgSuccess } = useContext(CartsContext)

  // state product
  const [image, setImage] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [price, setPrice] = useState('')
  const [sizes, setSizes] = useState([])
  const [idProduct, setIdProduct] = useState('')
  const [activeBoxSize, setActiveBoxSize] = useState(null)

  // user state
  const [idUser, setIdUser] = useState('')

  // state cart
  const [cartSizeId, setCartSizeId] = useState('')
  const [cartSize, setCartSize] = useState('')
  const [cartStock, setCartStock] = useState('')
  const [cartNote, setCartNote] = useState('')
  const [qty, setQty] = useState(1)
  const [errors, setErrors] = useState('')

  const [incrementCount, setIncrementCount] = useState(false)
  const [decrementCount, setDecrementCount] = useState(false)
  const [activeSize, setActiveSize] = useState(false)
  const [loadingSpinner, setLoadingSpinner] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)

  const param = useParams()

  useEffect(() => {
    fetchProductBySlug()
    getTotal()
    getToken()
  }, [])

  const getToken = async () => {
    try {
      const response = await axios.get('http://localhost:3001/auth/token')
      const decoded = jwtDecode(response.data.accessToken)
      setIdUser(decoded.userId)
    } catch (error) {

    }
  }

  const fetchProductBySlug = async () => {
    try {
      const response = await getProductBySlug(param.slug)
      const sanitazeDesc = sanitazeHTML(response.product.description)
      setIdProduct(response.product._id)
      setImage(response.product.url)
      setTitle(response.product.title)
      setDescription(sanitazeDesc)
      setCategory(response.product.id_category.title)
      setSubCategory(response.product.id_sub_category.title)
      setPrice(response.product.price)
      setSizes(response.sizeProduct)
    } catch (error) {
      console.log(error)
    }
  }

  const selectSize = async (id) => {
    setErrors('')
    setIncrementCount(false)
    setDecrementCount(false)
    setActiveSize(true)
    setQty(1)
    setCartSizeId('')
    setCartSize('')
    setCartStock('')
    setCartNote('')
    try {
      const response = await axios.get(`http://localhost:3001/products/size/${id}`)
      setCartSizeId(response.data._id)
      setCartSize(response.data.size)
      setCartStock(response.data.stock)
      setActiveBoxSize(id)
    } catch (error) {
      console.log(error)
    }
  }

  const incrementQty = () => {
    if (!activeSize) return setErrors('Pilih ukuran!')
    setDecrementCount(false)
    if (qty >= cartStock) return setIncrementCount(true)
    setQty(qty + 1)
  }

  const decrementQty = () => {
    if (!activeSize) return setErrors('Pilih ukuran!')
    setIncrementCount(false)
    if (qty <= 1) return setDecrementCount(true)
    setQty(qty - 1)
  }

  const getTotal = () => {
    const intPrice = parseInt(price.replace(/\./g, ""))
    const countTotal = intPrice * qty
    return countTotal.toLocaleString("id-ID")
  }

  const handleBuy = () => {
    if (!activeSize) return setErrors('Pilih ukuran!')
    if (qty === 0) return setErrors('Masukkan jumlah!')
  }

  const handleCart = async (e) => {
    if (!activeSize) return setErrors('Pilih ukuran!')
    if (qty === 0) return setErrors('Masukkan jumlah!')
    e.preventDefault()
    setLoadingSpinner(true)
    try {
      const total = getTotal()
      const data = {
        idUser, idProduct, qty, cartSizeId, cartNote, total
      }
      await addCarts(data)
      setModalSuccess(true)
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingSpinner(false)
      setTimeout(() => setModalSuccess(false), 2000)
    }
  }

  return (
    <>
      {loadingSpinner ? <LoadingSpinner /> : null}
      {modalSuccess ? <ModalSuccess msg={msgSuccess} close={() => setModalSuccess(false)} /> : null}
      <Header />
      <section className='mt-40 mb-96'>
        <div className='flex w-full'>
          <div className='w-1/2 justify-start ml-16'>
            <div className=''>
              <img className='w-72 h-72' src={image} alt='product image' />
            </div>
          </div>
          <div className='w-1/2 p-2'>
            <div className=''>
              <h3 className='text-lg font-bold text-textPrimary'>{title}</h3>
              <div>
                <div className='flex'>
                  <h3 className='flex text-sm text-textSecondary font-normal mt-2'>Terjual 100+ . </h3>
                  <svg aria-hidden="true" className="ml-1 w-5 h-5 text-yellow-300 mt-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  <h3 className='text-sm text-textPrimary font-normal mt-2'>4.7 (97 rating)</h3>
                </div>
                <h2 className='text-2xl mt-2 font-bold text-textPrimary'>Rp. {price} </h2>
                <div className='border-b mt-2 border-slate-200'></div>
              </div>
            </div>
            <div className='mt-2'>
              <h2 className='text-slate-700 text-base font-medium'>Pilih ukuran sepatu :</h2>
              <div className='flex mt-2'>
                {sizes.map(size => (
                  <div className='mr-1' key={size._id}>
                    <button onClick={() => selectSize(size._id)} type='button' className={`border px-2 py-1 rounded-sm ${activeBoxSize === size._id ? ' bg-cyan-500 right-1 text-white' : 'text-slate-800'} font-medium text-sm shadow-sm hover:bg-cyan-500 hover:ring-1 hover:text-white`}>
                      {size.size}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className='border-b mt-2 border-slate-200'></div>
            <div className='mt2'>
              <h2 className='text-textPrimary font-medium text-base'>Kategori :
                <Link className='text-slate-800 text-sm font-normal'> {category}, </Link>
                <Link className='text-slate-800 text-sm font-normal'> {subCategory}</Link>
              </h2>
            </div>
            <div className='border-b mt-2 border-slate-200'></div>
            <div className='mt-2'>
              <h2 className='text-slate-700 font-medium text-base'>Deskripsi</h2>
              <div className='mt-2 text-slate-800 text-sm font-normal' dangerouslySetInnerHTML={{ __html: description }} />
            </div>
          </div>

          {/* ADD CART */}
          <div className='w-1/3 pr-20 pl-6'>
            <div className='border p-3 shadow-md rounded-md w-fit'>

              {errors && <AlertErrors msg={errors} close={() => setErrors('')} />}

              <h2 className='text-slate-800 text-lg font-medium'>Jumlah dan catatan</h2>
              <div className='flex my-2'>
                <img className='w-16' src={image} />
                <p className='mt-5 ml-2 text-slate-600 text-sm font-normal'>ukuran: {cartSize || '-'} </p>
              </div>
              <div className='border-b'></div>
              <div className='flex mt-2'>
                <div className={`border rounded-md px-3`}>
                  <div className='flex'>
                    <button onClick={decrementQty} className={decrementCount ? 'text-base text-slate-300 font-medium pr-4 cursor-auto' : 'text-base text-slate-700 font-medium hover:text-red-500 pr-4'}>-</button>
                    <input type='text' className={`text-base font-medium text-slate-700 w-7 text-center focus:outline-none`} value={qty} readOnly />
                    <button onClick={incrementQty} className={incrementCount ? 'text-base font-medium text-slate-300 pl-4 cursor-auto' : 'text-base font-medium text-slate-700 hover:text-cyan-500 pl-4'}>+</button>
                  </div>
                </div>
                <div className='flex ml-3'>
                  <h3 className='text-slate-700 font-medium text-sm mt-1'>Stok : {cartStock || '-'} </h3>
                </div>
              </div>
              <div className='mt-3'>
                <h2 className='text-slate-700 text-sm font-medium'>Tambah catatan :</h2>
                <textarea rows='2' cols='30' value={cartNote} onChange={(e) => setCartNote(e.target.value)}
                  className="peer rounded-[7px] border border-blue-gray-200 text-xs font-normal text-blue-gray-700 outline outline-0 transition-all focus:border-2 focus:border-cyan-500 focus:outline-0 px-2 py-1" placeholder='optional'
                ></textarea>
              </div>
              <div className='flex justify-between mt-3'>
                <h3 className='text-slate-600 text-sm font-medium'>Subtotal</h3>
                <h3 className='text-slate-700 text-base font-medium'>Rp. {getTotal()}</h3>
              </div>
              <div className='flex justify-between mt-4'>
                <button onClick={handleBuy} className='border border-cyan-500 rounded-md py-1 px-5 w-32 text-base font-medium text-cyan-500 mr-2'>Beli</button>
                <button onClick={handleCart} className='border border-cyan-700 bg-cyan-500 text-white rounded-md py-1 px-5 w-32 text-base font-medium hover:bg-cyan-600'>+Keranjang</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default DetailProductUser
