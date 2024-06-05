import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../features/auth/authSlice'
import { AiOutlineMinus } from "react-icons/ai";
import AddShippingAddress from './addShippingAddress';
import { useDeleteShippingAddressMutation, useGetShippingAddressByUserQuery, useUpdateStatusShippingMutation } from '../../features/user/userApiSlice';
import LoadingSpinner from '../layouts/LoadingSpinner'
import ModalSuccess from '../layouts/ModalSuccess'
import ModalConfirm from '../layouts/ModalConfirm';

const ShippingAddress = () => {

  const user = useSelector(selectCurrentUser)
  const [disabledForm, setDisabledForm] = useState({
    status: true,
    shippingId: ''
  })
  const [addShipping, setAddShipping] = useState(false)
  const [msg, setMsg] = useState('')
  const [dataForDelete, setDataForDetele] = useState({
    shippingId: ''
  })
  const [modalConfirm, setModalConfirm] = useState(false)
  const [formData, setFormData] = useState({
    recipient_name: '',
    phone: '',
    address_label: '',
    city: '',
    complete_address: '',
    note_to_courier: ''
  })

  const { data: shippingAddress, refetch, isLoading: getShippingLoading } = useGetShippingAddressByUserQuery()
  const [updateStatusShipping, { isLoading: updateStatusShippingLoading, isSuccess, isError }] = useUpdateStatusShippingMutation()

  const handleChangeStatusShipping = async shipping => {
    if (shipping.status) return
    const data = {
      addressId: shipping._id,
      status: true
    }
    try {
      const response = await updateStatusShipping(data).unwrap()
      refetch()
      setMsg(response.msg)
      setTimeout(() => {
        setMsg('')
      }, 3000);
    } catch (error) {
      console.log(error)
    }
  }

  const handleConfirmDeleteData = async data => {
    if (data.status) return
    setDataForDetele({
      shippingId: data._id
    })
    setModalConfirm(true)
  }

  const [deleteShippingAddress, { isLoading: deleteShippingLoading, isSuccess: isSuccessDelete, isError: isErrorDelete }] = useDeleteShippingAddressMutation()
  const handleDeleteData = async event => {
    event.preventDefault()
    setModalConfirm(false)
    try {
      const response = await deleteShippingAddress(dataForDelete).unwrap()
      refetch()
      setMsg(response.msg)
      setTimeout(() => {
        setMsg('')
      }, 3000)
    } catch (error) {
      console.log(error)
    }
  }

  const handleEditData = async (id) => {
    setDisabledForm({
      ...disabledForm,
      status: false,
      shippingId: id
    })
  }

  const handleSaveData = () => {
    setDisabledForm({
      status: true,
      shippingId: ''
    })
    console.log('berhasil diedit')
  }

  return (
    <>
      {addShipping ? <AddShippingAddress close={() => setAddShipping(false)} /> : null}
      {getShippingLoading || updateStatusShippingLoading || deleteShippingLoading ? <LoadingSpinner /> : null}
      {isSuccess && msg !== '' || isSuccessDelete && msg !== '' ?
        <ModalSuccess msg={msg} close={() => setMsg('')} /> : null
      }
      {modalConfirm ? <ModalConfirm onConfirm={handleDeleteData} onCancel={() => setModalConfirm(false)} msg={'Are you sure deleted this data?'} /> : null}
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
                className={`
                  ${data.status && disabledForm.status ? 'border-textPrimary' : 'border-neutral-300'} 
                  ${disabledForm.status ? 'hover:border-textPrimary' : ''}
                  ${!disabledForm.status && disabledForm.shippingId === data._id ? 'border-textPrimary' : ''} 
                  ${!disabledForm.status && disabledForm.shippingId !== data._id ? 'cursor-not-allowed' : ''} 
                  border-2 shadow-md rounded-md p-4
                `}
              >
                {
                  data.status ?
                    <div className='absolute -ml-16'>
                      <AiOutlineMinus className='text-8xl font-extrabold rotate-90 text-textPrimary' />
                    </div>
                    : null
                }
                <div className='flex gap-4'>
                  <div>
                    <label className={`block mb-2 text-sm font-medium ${!disabledForm.status && disabledForm.shippingId === data._id ? 'text-textPrimary' : 'text-neutral-400'}`}>
                      recipient's name *
                    </label>
                    <input
                      type="text"
                      name="recipient_name"
                      id="recipient_name"
                      className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-64 ${!disabledForm.status && disabledForm.shippingId === data._id ? 'text-textPrimary' : 'text-neutral-400'}`}
                      placeholder="recipient name"
                      value={data.recipient_name}
                      // onChange={handleChangeInput}
                      disabled={disabledForm.status}
                    />
                  </div>
                  <div>
                    <label className={`block mb-2 text-sm font-medium ${!disabledForm.status && disabledForm.shippingId === data._id ? 'text-textPrimary' : 'text-neutral-400'}`}>
                      Phone *
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-52 ${!disabledForm.status && disabledForm.shippingId === data._id ? 'text-textPrimary' : 'text-neutral-400'}`}
                      placeholder="phone"
                      value={data.phone}
                      disabled={disabledForm.status}
                    />
                  </div>
                  <div>
                    <label className={`block mb-2 text-sm font-medium ${!disabledForm.status && disabledForm.shippingId === data._id ? 'text-textPrimary' : 'text-neutral-400'}`}>
                      Address Label *
                    </label>
                    <select
                      id="label_address"
                      className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-64 ${!disabledForm.status && disabledForm.shippingId === data._id ? 'text-textPrimary' : 'text-neutral-400'}`}
                      disabled={disabledForm.status}
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
                    <label className={`block mb-2 text-sm font-medium ${!disabledForm.status && disabledForm.shippingId === data._id ? 'text-textPrimary' : 'text-neutral-400'}`}>
                      Address *
                    </label>
                    <textarea
                      className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-80 ${!disabledForm.status && disabledForm.shippingId === data._id ? 'text-textPrimary' : 'text-neutral-400'}`}
                      value={data.complete_address}
                      disabled={disabledForm.status}>
                    </textarea>
                  </div>
                  <div>
                    <label className={`block mb-2 text-sm font-medium ${!disabledForm.status && disabledForm.shippingId === data._id ? 'text-textPrimary' : 'text-neutral-400'}`}>
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-40 ${!disabledForm.status && disabledForm.shippingId === data._id ? 'text-textPrimary' : 'text-neutral-400'}`}
                      placeholder="city"
                      value={data.city}
                      disabled={disabledForm.status}
                    />
                  </div>
                  <div>
                    <label className={`block mb-2 text-sm font-medium ${!disabledForm.status && disabledForm.shippingId === data._id ? 'text-textPrimary' : 'text-neutral-400'}`}>
                      Note to courier
                    </label>
                    <textarea
                      className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-80 ${!disabledForm.status && disabledForm.shippingId === data._id ? 'text-textPrimary' : 'text-neutral-400'}`}
                      value={data.note_to_courier}
                      disabled={disabledForm.status}>
                    </textarea>
                  </div>
                </div>
                <div className={`flex justify-between mt-7`}>
                  <div className='flex self-center gap-2'>
                    <input
                      type='checkbox'
                      checked={data.status}
                      className={`h-5 w-5  ${!data.status ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                      onChange={() => handleChangeStatusShipping(data)}
                      disabled={!disabledForm.status && disabledForm.shippingId !== data._id ? true : false}
                    />
                    <label className='mb-2 text-textPrimary text-sm font-medium'>make it the main address</label>
                  </div>
                  <div>
                    {
                      !disabledForm.status && disabledForm.shippingId === data._id ?
                        <>
                          <div className='flex gap-2'>
                            <button
                              className='text-textPrimary text-sm border px-5 py-1 font-medium rounded-md hover:bg-red-500 hover:text-white'
                              onClick={() => setDisabledForm({ status: true, shippingId: '' })}
                            >
                              Cancel
                            </button>
                            <button
                              className='text-textPrimary text-sm border px-5 py-1 font-medium rounded-md hover:bg-bgPrimaryDark hover:text-white'
                              onClick={handleSaveData}
                            >
                              Save
                            </button>
                          </div>
                        </>
                        :
                        <div className='flex gap-2'>
                          <button
                            className={`text-sm border px-5 py-1 font-medium rounded-md ${!disabledForm.status ? 'text-neutral-400' : 'text-textPrimary hover:bg-bgPrimaryDark hover:text-white'} `}
                            onClick={() => handleEditData(data._id)}
                            disabled={!disabledForm.status ? true : false}
                          >
                            Edit
                          </button>
                          <button
                            title={data.status ? "You can't deleted this data" : ""}
                            className={`text-sm border px-5 py-1 font-medium rounded-md 
                            ${!disabledForm.status ? 'text-neutral-400' : 'text-textPrimary hover:bg-red-500 hover:text-white'} 
                            ${data.status ? 'cursor-not-allowed' : ''}
                            `}
                            onClick={() => handleConfirmDeleteData(data)}
                            disabled={data.status ? true : false}
                          >
                            Delete
                          </button>
                        </div>
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