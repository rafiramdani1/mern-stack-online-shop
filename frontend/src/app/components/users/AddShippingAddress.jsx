import anime from 'animejs'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../features/auth/authSlice'
import { useAddShippingAddressMutation, useGetShippingAddressByUserQuery } from '../../features/user/userApiSlice'
import AlertErrors from '../layouts/AlertErrors'
import LoadingSpinner from '../layouts/LoadingSpinner'
import ModalSuccess from '../layouts/ModalSuccess'
import { useNavigate } from 'react-router-dom'

const AddShippingAddress = ({ close }) => {

  const user = useSelector(selectCurrentUser)
  const navigate = useNavigate()

  const layoutModalRef = useRef(null)
  useEffect(() => {
    anime({
      targets: layoutModalRef.current,
      translateY: 250,
      duration: 500,
      autoplay: true,
      easing: 'easeInOutSine'
    })
  }, [])

  const { data: shipping, refetch } = useGetShippingAddressByUserQuery()

  const [formData, setFormData] = useState({
    recipient_name: '',
    phone: '',
    address_label: '',
    city: '',
    complete_address: '',
    note_to_courier: '',
    status: shipping?.data === null ? true : false,
  })
  const [msg, setMsg] = useState('')

  const handleChangeInput = async event => {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleChangeCheckbox = async event => {
    const status = event.target.checked
    setFormData({
      ...formData,
      status: status
    })
  }

  const handleCloseMsg = async () => {
    setMsg('')
    close()
  }

  const [addShipping, { isLoading, isSuccess, isError }] = useAddShippingAddressMutation()
  const handleSaveAddShipping = async e => {
    e.preventDefault()
    try {
      const response = await addShipping(formData).unwrap()
      refetch()
      setMsg(response.msg)
      setTimeout(() => {
        close()
      }, 3000)
    } catch (error) {
      setMsg(error.data.msg)
    }
  }

  return (
    <>
      {isLoading ? <LoadingSpinner /> : null}
      {isSuccess && msg !== '' ? <ModalSuccess msg={msg} close={handleCloseMsg} /> : null}
      <div
        ref={layoutModalRef}
        className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[70] outline-none focus:outline-none">
        <div className="relative w-full my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between px-6 py-4 border-b border-solid border-zinc-200 rounded-t">
              <h3 className="font-semibold text-base md:text-lg text-textPrimary">
                Form Add Shipping Address
              </h3>
              <button onClick={close}>
                <i className="uil uil-multiply text-textPrimary font-semibold hover:text-red-500"></i>
              </button>
            </div>
            {/*body*/}
            <div className="p-7">
              {/* error message */}
              {isError && msg !== '' ?
                <AlertErrors
                  msg={msg}
                  close={() => setMsg('')}
                />
                : null
              }
              <form action='#'>
                <div className='flex gap-4'>
                  <div>
                    <label className="block mb-2 text-textPrimary text-sm font-medium">
                      recipient's name *
                    </label>
                    <input
                      type="text"
                      name="recipient_name"
                      id="recipient_name"
                      className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-52 text-textPrimary`}
                      placeholder="recipient's name"
                      value={formData.recipient_name}
                      onChange={handleChangeInput}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-textPrimary text-sm font-medium">
                      Phone *
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-52 text-textPrimary`}
                      placeholder="phone"
                      value={formData.phone}
                      onChange={handleChangeInput}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-textPrimary text-sm font-medium">
                      Address Label *
                    </label>
                    <select
                      name='address_label'
                      id="address_label"
                      className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-64 text-textPrimary`}
                      value={formData.address_label}
                      onChange={handleChangeInput}
                    >
                      <option value={'-'}>Select</option>
                      <option value="House">House</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Boarding House">Boarding House</option>
                      <option value="Office">Office</option>
                    </select>
                  </div>
                </div>
                <div className='flex gap-4 mt-4'>
                  <div>
                    <label className="block mb-2 text-textPrimary text-sm font-medium">
                      Address *
                    </label>
                    <textarea
                      name='complete_address'
                      id='complete_address'
                      className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-80 text-textPrimary`}
                      placeholder='complete address'
                      value={formData.complete_address}
                      onChange={handleChangeInput}>
                    </textarea>
                  </div>
                  <div>
                    <label className="block mb-2 text-textPrimary text-sm font-medium">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-40 text-textPrimary`}
                      placeholder="city"
                      value={formData.city}
                      onChange={handleChangeInput}
                    />
                  </div>
                </div>
                <div className=' flex gap-4 mt-4'>
                  <div>
                    <label className="block mb-2 text-textPrimary text-sm font-medium">
                      Note to courier
                    </label>
                    <textarea
                      name='note_to_courier'
                      id='note_to_courier'
                      className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-80 text-textPrimary`}
                      value={formData.note_to_courier}
                      onChange={handleChangeInput}
                    >
                    </textarea>
                  </div>
                </div>
                <div className='flex justify-between mt-7'>
                  <div className='flex self-center gap-2'>
                    <input
                      type='checkbox'
                      checked={shipping?.data === null ? true : null}
                      className='h-5 w-5 cursor-pointer'
                      value={formData.status}
                      onChange={handleChangeCheckbox}
                      disabled={shipping?.data === null ? true : false}
                    />
                    <div className=''>
                      <label className='mb-2 text-textPrimary text-sm font-medium'>make it the main address</label>
                      {shipping?.data === null ?
                        <p className='text-xs'>will automatically activate because there is no other shipping data</p>
                        : ''
                      }
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={handleSaveAddShipping}
                      className='text-textPrimary text-sm border px-5 py-1 font-medium rounded-md hover:bg-bgPrimaryDark hover:text-white'
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-40 fixed inset-0 z-[60] bg-black"></div>
    </>
  )
}

export default AddShippingAddress