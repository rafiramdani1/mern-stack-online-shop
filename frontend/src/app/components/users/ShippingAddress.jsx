import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../features/auth/authSlice'
import { AiOutlineMinus } from "react-icons/ai";
import { Link } from 'react-router-dom';
import AddShippingAddress from './addShippingAddress';
import { useGetShippingAddressByUserQuery, useUpdateStatusShippingMutation } from '../../features/user/userApiSlice';
import LoadingSpinner from '../layouts/LoadingSpinner'
import ModalSuccess from '../layouts/ModalSuccess'

const ShippingAddress = () => {

  const user = useSelector(selectCurrentUser)
  const [disabledForm, setDisabledForm] = useState(true)
  const [activeMainAddress, setActiveMainAddress] = useState(false)
  const [addShipping, setAddShipping] = useState(false)
  const [msg, setMsg] = useState('')

  const { data: shippingAddress, refetch, isLoading: getShippingLoading } = useGetShippingAddressByUserQuery()
  const [updateStatusShipping, { isLoading: updateStatusShippingLoading, isSuccess, isError }] = useUpdateStatusShippingMutation()

  const handleChangeStatusShipping = async shipping => {
    if (shipping.status) return
    const data = {
      userId: user?.userId,
      addressId: shipping._id,
      status: true
    }
    try {
      const response = await updateStatusShipping(data).unwrap()
      refetch()
      setMsg(response.msg)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSaveData = () => {
    setDisabledForm(true)
    console.log('berhasil diedit')
  }

  return (
    <>
      {addShipping ?
        <AddShippingAddress close={() => setAddShipping(false)} />
        : null
      }
      {
        getShippingLoading || updateStatusShippingLoading ? <LoadingSpinner /> : null
      }
      {
        isSuccess && msg !== '' ? <ModalSuccess msg={msg} close={() => setMsg('')} /> : null
      }
      <div className=''>
        <div className='flex justify-start px-5 mt-3'>
          <button
            onClick={() => setAddShipping(true)}
            className='text-white bg-bgSecondaryDark text-sm border px-5 py-1 font-medium rounded-md hover:bg-bgPrimaryDark'>
            Add address
          </button>
        </div>
        {
          shippingAddress?.data?.addresses.map((data, i) => (
            <div className='px-5 py-3' key={i}>
              <div
                className={`${data.status ? 'border-2 border-textPrimary' : 'border border-neutral-300 hover:border-textPrimary'} shadow-md rounded-md p-4`}>
                {
                  data.status ?
                    <div className='absolute -ml-16'>
                      <AiOutlineMinus className='text-8xl font-extrabold rotate-90 text-textPrimary' />
                    </div>
                    : null
                }
                <div className='flex gap-4'>
                  <div>
                    <label className="block mb-2 text-textPrimary text-sm font-medium">
                      recipient's name *
                    </label>
                    <input
                      type="text"
                      name="fullname"
                      id="fullname"
                      className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-64 ${disabledForm ? 'text-neutral-400' : 'text-textPrimary'}`}
                      placeholder="fullname"
                      value={data.recipient_name}
                      disabled={disabledForm}
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
                      className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-52 ${disabledForm ? 'text-neutral-400' : 'text-textPrimary'}`}
                      placeholder="phone"
                      value={data.phone}
                      disabled={disabledForm}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-textPrimary text-sm font-medium">
                      Address Label *
                    </label>
                    <select
                      id="label_address"
                      className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-64 ${disabledForm ? 'text-neutral-400' : 'text-textPrimary'}`}
                      disabled={disabledForm}
                      value={data.address_label}
                    // onChange={handleChangeInputSelect}
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
                      className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-80 ${disabledForm ? 'text-neutral-400' : 'text-textPrimary'}`}
                      value={data.complete_address}
                      disabled={disabledForm}>
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
                      className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-40 ${disabledForm ? 'text-neutral-400' : 'text-textPrimary'}`}
                      placeholder="city"
                      value={data.city}
                      disabled={disabledForm}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-textPrimary text-sm font-medium">
                      Note to courier
                    </label>
                    <textarea
                      className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-80 ${disabledForm ? 'text-neutral-400' : 'text-textPrimary'}`}
                      value={data.note_to_courier}
                      disabled={disabledForm}>
                    </textarea>
                  </div>
                </div>
                <div className={`flex ${disabledForm ? 'justify-between' : 'justify-end'}  mt-7`}>
                  {
                    disabledForm ?
                      <div className='flex self-center gap-2'>
                        <input
                          type='checkbox'
                          checked={data.status}
                          className={`h-5 w-5 ${data.status ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                          onChange={() => handleChangeStatusShipping(data)}
                          disabled={data.status ? true : false}
                        />
                        <label className='mb-2 text-textPrimary text-sm font-medium'>make it the main address</label>
                      </div>
                      : null
                  }
                  <div>
                    {
                      disabledForm ?
                        <button
                          className='text-textPrimary text-sm border px-5 py-1 font-medium rounded-md hover:bg-bgPrimaryDark hover:text-white'
                          onClick={() => setDisabledForm(false)}
                        >
                          Edit Data
                        </button>
                        :
                        <button
                          className='text-textPrimary text-sm border px-5 py-1 font-medium rounded-md hover:bg-bgPrimaryDark hover:text-white'
                          onClick={handleSaveData}
                        >
                          Save
                        </button>
                    }
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default ShippingAddress