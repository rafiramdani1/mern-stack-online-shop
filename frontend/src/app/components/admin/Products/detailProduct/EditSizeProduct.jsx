import React, { useContext, useEffect, useState } from 'react'
import { useGetSizesQuery } from '../../../../features/sizes/sizesApiSlice'
import { useGetProductByIdQuery, useGetSizeProductByIdQuery, useUpdateSizeProductMutation } from '../../../../features/products/productsApiSlice'
import LoadingSpinner from '../../../layouts/LoadingSpinner'
import ModalSuccess from '../../../layouts/ModalSuccess'
import AlertErrors from '../../../layouts/AlertErrors'
import { useParams } from 'react-router-dom'

const EditSizeProduct = ({ idSizeProduct, closeModal }) => {

  const { id: idProduct } = useParams()

  const { data: sizes } = useGetSizesQuery()
  const { data: sizeProduct, refetch: refetchSizeProduct } = useGetSizeProductByIdQuery(idSizeProduct)
  const { refetch } = useGetProductByIdQuery(idProduct)

  const [size, setSize] = useState('')
  const [oldSize, setOldSize] = useState('')
  const [stock, setStock] = useState('')
  const [msgSuccess, setMsgSuccess] = useState('')

  useEffect(() => {
    if (sizeProduct) {
      setSize(sizeProduct.data.size)
      setOldSize(sizeProduct.data.size)
      setStock(sizeProduct.data.stock)
    }
  }, [sizeProduct])

  const handleChangeSize = (e) => {
    setSize(e.target.value)
  }
  const handleChangeStock = (e) => {
    setStock(e.target.value)
  }

  const [updateSizeProduct, { isLoading, isError, error, isSuccess, reset }] = useUpdateSizeProductMutation()

  const handleEditSizeProduct = async (e) => {
    e.preventDefault()
    try {
      const response = await updateSizeProduct({ size, oldSize, stock, idSizeProduct, idProduct }).unwrap()
      setMsgSuccess(response.msg)
      await refetch()
      await refetchSizeProduct()
    } catch (error) {
      return
    }
  }

  return (
    <>
      {isLoading ? <LoadingSpinner /> : null}
      {isSuccess ? <ModalSuccess msg={msgSuccess} close={closeModal} /> : null}

      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[70] outline-none focus:outline-none">
        <div className="relative w-1/4 my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between px-6 py-5 border-b border-solid border-zinc-200 rounded-t">
              <h3 className="font-semibold text-base md:text-lg text-textPrimary">
                Edit Ukuran & Stock Produk
              </h3>
            </div>
            {/*body*/}
            <div className="p-6">

              <form onSubmit={handleEditSizeProduct} action='#'>

                {isError && (<AlertErrors msg={error.data.msg} close={reset} />)}

                <div className='flex mt-3'>
                  <div className='relative pr-2'>
                    <label className="block mb-2 text-textSecondary text-sm font-medium">Size</label>
                    <select className='block text-xs font-normal appearance-none w-28 bg-gray-50 border border-gray-300 text-gray-900 py-2 px-4 pr-8leading-tight focus:outline-none rounded-lg focus:bg-white focus:border-gray-500' value={size} onChange={handleChangeSize}>
                      <option value=''>Pilih Ukuran</option>
                      {sizes?.map(size => (
                        <option key={size._id}>{size.size}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 flex items-center px-2 text-gray-700 left-20 mt-7">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-textSecondary text-sm font-medium">Stok</label>
                    <input type="price" name="price" id="price"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2"
                      placeholder="Stok" value={stock} onChange={handleChangeStock} />
                  </div>
                  <input type='hidden' value={oldSize} readOnly />
                </div>
                <button type="submit"
                  className="w-full font-medium text-textPrimary hover:text-white hover:bg-hoverBgButton border border-borderButton focus:ring-2 focus:outline-none focus:ring-ringFocusBtn rounded-lg text-sm px-5 py-2.5 text-center mt-5"
                  disabled={isLoading || msgSuccess !== ''}
                >Edit</button>
              </form>

            </div>

            {/*footer*/}
            <div className="flex items-center justify-end p-3 border-t border-solid border-zinc-200 rounded-b">
              <button onClick={closeModal}
                className="text-textPrimary font-medium rounded-lg text-sm px-4 py-2 hover:text-red-600"
                type="button"
              >
                close
              </button>
            </div>

          </div>
        </div>
      </div>
      <div className="opacity-40 fixed inset-0 z-[60] bg-black"></div>
    </>
  )
}

export default EditSizeProduct
