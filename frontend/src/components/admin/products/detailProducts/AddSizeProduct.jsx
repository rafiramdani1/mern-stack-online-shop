import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import AlertErrors from '../../../layouts/AlertErrors'
import ModalSuccess from '../../../layouts/ModalSuccess'
import LoadingSpinner from '../../../layouts/Loading'
import { ProductsContext } from '../ProductsContext'

const AddSizeProduct = ({ close, onProductSizeAdded }) => {

  const { getSizes, sizes } = useContext(ProductsContext)
  const [addSize, setAddSize] = useState('')
  const [addStock, setAddStock] = useState('')
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState('')
  const [modalSuccess, setModalSuccess] = useState(false)
  const [loadingSpinner, setLoadingSpinner] = useState(false)
  const param = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    getSizes()
  }, [])

  const handleChangeSize = e => {
    setAddSize(e.target.value)
    setErrors('')
  }

  const handleChangeStock = e => {
    setAddStock(e.target.value)
    setErrors('')
  }

  const handleAddSizeProduct = async e => {
    e.preventDefault()
    setLoadingSpinner(true)
    try {
      const idProduct = param.id
      const response = await axios.post('http://localhost:3001/products/add-size', { addSize, addStock, idProduct })
      onProductSizeAdded(response.data.msg)
      setSuccess(response.data.msg)
      setModalSuccess(true)
      setTimeout(() => setModalSuccess(false), 2000)
    } catch (error) {
      if (error.response) {
        setErrors(error.response.data.msg)
      }
    } finally {
      setLoadingSpinner(false)
    }
  }

  return (
    <>
      {loadingSpinner ? <LoadingSpinner /> : null}
      {modalSuccess ? <ModalSuccess msg={success} close={() => setModalSuccess(false)} /> : null}
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[70] outline-none focus:outline-none">
        <div className="relative w-1/3 my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between px-6 py-5 border-b border-solid border-zinc-200 rounded-t">
              <h3 className="font-semibold text-base md:text-lg text-textPrimary">
                Tambah Ukuran Produk
              </h3>
            </div>
            {/*body*/}
            <div className="p-6">
              {errors && <AlertErrors msg={errors} close={() => setErrors('')} />}
              <form onSubmit={handleAddSizeProduct} className="w-full max-w-lg" action='#'>

                <div className='flex'>
                  <div className='mb-2'>
                    <div className='relative mr-3'>
                      <label className="mb-2 text-sm font-bold text-textPrimary">Ukuran</label>
                      <select className='block appearance-none w-fit text-sm text-textPrimary bg-bgInput border border-borderInput py-2.5 px-4 pr-8 leading-tight focus:outline-none rounded-lg focus:bg-white focus:border-focusBorderInput' value={addSize} onChange={handleChangeSize}>
                        <option value=''>Pilih Ukuran</option>
                        {sizes.map(size => (
                          <option key={size._id}>{size.size}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 flex items-center px-2 text-textPrimary left-24 mt-6">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label
                      className="mb-2 text-sm font-bold text-textPrimary">Stok</label>
                    <input type="text" name="slug" placeholder="stok"
                      className="bg-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5" value={addStock} onChange={handleChangeStock} />
                  </div>
                </div>

                <button type="submit"
                  className="w-full font-medium text-textPrimary hover:text-white hover:bg-hoverBgButton border border-borderButton focus:ring-2 focus:outline-none focus:ring-ringFocusBtn rounded-lg text-sm px-5 py-2.5 text-center mt-5">Tambah</button>
              </form>

            </div>

            {/*footer*/}
            <div className="flex items-center justify-end p-3 border-t border-solid border-zinc-200 rounded-b">
              <button onClick={close}
                className="text-textPrimary font-medium rounded-lg text-sm px-4 py-2 hover:text-red-600"
                type="button"
              >
                close
              </button>
            </div>

          </div>
        </div>
      </div >
      <div className="opacity-40 fixed inset-0 z-[60] bg-black"></div>
    </>
  )
}

export default AddSizeProduct
