import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetSizesQuery } from '../../../../features/sizes/sizesApiSlice'
import { useAddSizeProductMutation, useGetProductByIdQuery } from '../../../../features/products/productsApiSlice'
import AlertErrors from '../../../layouts/AlertErrors'
import LoadingSpinner from '../../../layouts/LoadingSpinner'
import ModalSuccess from '../../../layouts/ModalSuccess'

const AddSizeProduct = ({ close, onProductSizeAdded }) => {

  // use get sizes products
  const { data: sizes, isLoading } = useGetSizesQuery()

  // locale state
  const [addSize, setAddSize] = useState('')
  const [addStock, setAddStock] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const { id: idProduct } = useParams()

  const handleChangeSize = e => {
    setAddSize(e.target.value)
  }

  const handleChangeStock = e => {
    setAddStock(e.target.value)
  }

  // use add size product
  const [addSizeProduct, { isLoading: loadingAddSize, isError, error, isSuccess, reset }] = useAddSizeProductMutation()

  // use refetch products by id
  const { refetch } = useGetProductByIdQuery(idProduct)

  const handleAddSizeProduct = async e => {
    e.preventDefault()
    try {
      const response = await addSizeProduct({ addSize, addStock, idProduct }).unwrap()
      setSuccessMsg(response.msg)
      await refetch()
    } catch (error) {
      return
    }
  }

  return (
    <>
      {loadingAddSize ? <LoadingSpinner /> : null}
      {isSuccess ? <ModalSuccess msg={successMsg} close={close} /> : null}

      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[70] outline-none focus:outline-none">
        <div className="relative w-1/4 my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between px-6 py-4 border-b border-solid border-zinc-200 rounded-t">
              <h3 className="font-semibold text-base md:text-lg text-textPrimary">
                Form Add Size Product
              </h3>
              <button onClick={close}><i className="uil uil-multiply text-textPrimary font-semibold hover:text-red-500"></i></button>
            </div>
            {/*body*/}
            <div className="p-6">

              {isError && <AlertErrors msg={error.data.msg} close={reset} />}

              <form onSubmit={handleAddSizeProduct} action='#'>

                <div className='flex'>
                  <div className='mb-2'>
                    <div className='relative mr-3'>
                      <label className="mb-2 text-sm font-bold text-textPrimary">Size</label>
                      <select className='block appearance-none w-fit text-sm text-textPrimary bg-bgInput border border-borderInput py-2.5 px-4 pr-8 leading-tight focus:outline-none rounded-lg focus:bg-white focus:border-focusBorderInput' value={addSize} onChange={handleChangeSize}>
                        <option value=''>Select Size</option>
                        {sizes?.map(size => (
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
                      className="mb-2 text-sm font-bold text-textPrimary">Stock</label>
                    <input type="text" name="slug" placeholder="stock"
                      className="bg-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5" value={addStock} onChange={handleChangeStock} />
                  </div>
                </div>

                <button type="submit"
                  className="w-full font-medium text-textPrimary hover:text-white hover:bg-hoverBgButton border border-borderButton focus:ring-2 focus:outline-none focus:ring-ringFocusBtn rounded-lg text-sm px-5 py-2.5 text-center mt-5"
                  disabled={loadingAddSize || successMsg !== ''}
                >Add size product</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-40 fixed inset-0 z-[60] bg-black"></div>
    </>
  )
}

export default AddSizeProduct
