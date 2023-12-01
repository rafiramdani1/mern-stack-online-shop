import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { useGetProductBySlugQuery } from '../../features/products/productsApiSlice'
import { useDispatch, useSelector } from 'react-redux'
import { getSizeById } from '../../features/sizes/sizesSlice'
import AlertErrors from '../layouts/AlertErrors'
import { resetState, selectQuantityCart, selectsubTotalCart, setDecrementQty, setIncrementQty, setPrice } from '../../features/cart/cartSlice'
import { selectCurrentToken, selectCurrentUser } from '../../features/auth/authSlice'
import { useAddCartMutation, useGetCartsQuery } from '../../features/cart/cartApiSlice'
import LoadingSpinner from '../layouts/LoadingSpinner'
import ModalSuccess from '../layouts/ModalSuccess'

const sanitazeHTML = (html) => {
  return DOMPurify.sanitize(html)
}

const DetailProductUser = () => {

  // get param
  const { slug: slugProduct } = useParams()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // use get product by slug
  const { data: product, isLoading } = useGetProductBySlugQuery(slugProduct)

  // get state global
  const qty = useSelector(selectQuantityCart)
  const subTotalCart = useSelector(selectsubTotalCart)
  const user = useSelector(selectCurrentUser)
  const token = useSelector(selectCurrentToken)

  // locale state
  const [incrementCount, setIncrementCount] = useState(false)
  const [decrementCount, setDecrementCount] = useState(false)
  const [activeBoxSize, setActiveBoxSize] = useState(null)
  const [activeSize, setActiveSize] = useState(false)
  const [msgSuccess, setMsgSuccess] = useState('')
  const [errors, setErrors] = useState('')

  // state cart
  const [cartSizeId, setCartSizeId] = useState('')
  const [cartSize, setCartSize] = useState('')
  const [cartStock, setCartStock] = useState('')
  const [cartNote, setCartNote] = useState('')

  // handle select size product
  const selectSize = async (id) => {
    setErrors('')
    dispatch(setPrice(product?.product.price))
    setIncrementCount(false)
    setDecrementCount(false)
    setActiveSize(true)
    setCartSizeId('')
    setCartSize('')
    setCartStock('')
    setCartNote('')
    try {
      const response = await dispatch(getSizeById(id))
      setCartSizeId(response._id)
      setCartSize(response.size)
      setCartStock(response.stock)
      setActiveBoxSize(id)
    } catch (error) {
      console.log(error)
    }
  }

  const incrementQty = async () => {
    if (!activeSize) return setErrors('Pilih ukuran!')
    setDecrementCount(false)
    if (qty >= cartStock) return setIncrementCount(true)
    await dispatch(setIncrementQty())
  }

  const decrementQty = async () => {
    if (!activeSize) return setErrors('Pilih ukuran!')
    setIncrementCount(false)
    if (qty <= 1) return setDecrementCount(true)
    await dispatch(setDecrementQty())
  }

  // use add cart
  const [addCart, { isLoading: loadingAddCart, isError, error, isSuccess, reset }] = useAddCartMutation()

  // use refetch carts 
  const { refetch } = useGetCartsQuery()

  // handle close modal
  const handleCloseModalSuccess = () => {
    reset()
    setMsgSuccess('')
  }

  const handleCart = async (e) => {
    if (!token || !user) {
      navigate('/login')
    }
    if (!activeSize) return setErrors('Pilih ukuran!')
    if (qty === 0) return setErrors('Masukkan jumlah!')
    e.preventDefault()
    const data = {
      idUser: user?.userId,
      idProduct: product?.product._id,
      qty,
      cartSizeId,
      cartNote,
      total: subTotalCart
    }
    try {
      const response = await addCart(data).unwrap()
      setMsgSuccess(response.msg)
      console.log(response)
      // call refetch carts
      await refetch()

      // reset state
      setActiveBoxSize(null)
      setActiveSize(false)
      setCartNote('')
      setCartSize('')
      setCartSizeId('')
      setCartStock('')
      await dispatch(resetState())

      setTimeout(() => {
        reset()
        setMsgSuccess('')
      }, 2000)
    } catch (error) {
      return
    }
  }

  const handleBuy = () => {
    if (!activeSize) return setErrors('Pilih ukuran!')
    if (qty === 0) return setErrors('Masukkan jumlah!')
  }

  return (
    <>
      {loadingAddCart ? <LoadingSpinner /> : null}

      {isSuccess && msgSuccess !== '' ? <ModalSuccess msg={msgSuccess} close={handleCloseModalSuccess} /> : null}

      <section className='mt-40 mb-96'>
        <div className='flex w-full'>
          <div className='w-1/2 justify-start ml-16'>
            <div className=''>
              <img className='w-72 h-72' src={product?.product.url} alt='product image' />
            </div>
          </div>
          <div className='w-1/2 p-2'>
            <div className=''>
              <h3 className='text-lg font-bold text-textPrimary'>{product?.product.title}</h3>
              <div>
                <div className='flex'>
                  <h3 className='flex text-sm text-textSecondary font-normal mt-2'>Terjual 100+ . </h3>
                  <svg aria-hidden="true" className="ml-1 w-5 h-5 text-yellow-300 mt-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  <h3 className='text-sm text-textPrimary font-normal mt-2'>4.7 (97 rating)</h3>
                </div>
                <h2 className='text-2xl mt-2 font-bold text-textPrimary'>Rp. {product?.product.price} </h2>
                <div className='border-b mt-2 border-slate-200'></div>
              </div>
            </div>
            <div className='mt-2'>
              <h2 className='text-slate-700 text-base font-medium'>Pilih ukuran sepatu :</h2>
              <div className='flex mt-2'>
                {product?.sizeProduct.map(size => (
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
                <Link className='text-slate-800 text-sm font-normal'> {product?.product.id_category.title},</Link>
                <Link className='text-slate-800 text-sm font-normal'> {product?.product.id_sub_category.title}</Link>
              </h2>
            </div>
            <div className='border-b mt-2 border-slate-200'></div>
            <div className='mt-2'>
              <h2 className='text-slate-700 font-medium text-base'>Deskripsi</h2>
              <div className='mt-2 text-slate-800 text-sm font-normal' dangerouslySetInnerHTML={{ __html: sanitazeHTML(product?.product.description) }} />
            </div>
          </div>

          {/* ADD CART */}
          <div className='w-1/3 pr-20 pl-6'>
            <div className='border p-3 shadow-md rounded-md w-fit'>

              {errors && <AlertErrors msg={errors} close={() => setErrors('')} />}

              <h2 className='text-slate-800 text-lg font-medium'>Jumlah dan catatan</h2>
              <div className='flex my-2'>
                <img className='w-16' src={product?.product.url} />
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
                <textarea rows='2' cols='30'
                  className="peer rounded-[7px] border border-blue-gray-200 text-xs font-normal text-blue-gray-700 outline outline-0 transition-all focus:border-2 focus:border-cyan-500 focus:outline-0 px-2 py-1" placeholder='optional' value={cartNote} onChange={(e) => setCartNote(e.target.value)}
                ></textarea>
              </div>
              <div className='flex justify-between mt-3'>
                <h3 className='text-slate-600 text-sm font-medium'>Subtotal</h3>
                <h3 className='text-slate-700 text-base font-medium'>Rp. {subTotalCart}</h3>
              </div>
              <div className='flex justify-between mt-4'>
                <button
                  className='border border-cyan-500 rounded-md py-1 px-5 w-32 text-base font-medium text-cyan-500 mr-2'
                  onClick={handleBuy}
                >Beli</button>
                <button className='border border-cyan-700 bg-cyan-500 text-white rounded-md py-1 px-5 w-32 text-base font-medium hover:bg-cyan-600'
                  onClick={handleCart}
                >+Keranjang</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default DetailProductUser
