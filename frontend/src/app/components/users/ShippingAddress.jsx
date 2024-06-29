import React, { useState } from 'react'
import { AiOutlineMinus } from "react-icons/ai";
import AddShippingAddress from './addShippingAddress';
import { useDeleteShippingAddressMutation, useGetShippingAddressByUserQuery, useUpdateShippingAddressMutation, useUpdateStatusShippingMutation } from '../../features/user/userApiSlice';
import LoadingSpinner from '../layouts/LoadingSpinner'
import ModalSuccess from '../layouts/ModalSuccess'
import ModalConfirm from '../layouts/ModalConfirm';
import AlertErrors from '../layouts/AlertErrors';

const ShippingAddress = () => {

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
  const [editindData, setEditingData] = useState(null)
  const [formData, setFormData] = useState({
    shippingId: '',
    recipient_name: '',
    phone: '',
    address_label: '',
    complete_address: '',
    city: '',
    note_to_courier: '',
    status: ''
  })

  const { data: shippingAddress, refetch, isLoading: getShippingLoading } = useGetShippingAddressByUserQuery()
  const [updateStatusShipping, { isLoading: updateStatusShippingLoading, isSuccess: isSuccessUpdateStatusShipping }] = useUpdateStatusShippingMutation()

  const handleChangeStatusShipping = async shipping => {
    if (shipping.status) return
    const data = {
      addressId: shipping._id,
      status: true
    }
    try {
      const response = await updateStatusShipping(data).unwrap()
      refetch()
      setDisabledForm({
        status: true,
        shippingId: ''
      })
      setEditingData(null)
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

  const [deleteShippingAddress, { isLoading: deleteShippingLoading, isSuccess: isSuccessDelete }] = useDeleteShippingAddressMutation()
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

  const handleCancelEdit = async e => {
    setDisabledForm({
      status: true,
      shippingId: ''
    })
    setEditingData(null)
  }

  const handleChangeInput = async e => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleEditData = async (data) => {
    setDisabledForm({
      ...disabledForm,
      status: false,
      shippingId: data._id
    })
    setEditingData(data._id)
    setFormData({
      ...formData,
      shippingId: data._id,
      recipient_name: data.recipient_name,
      phone: data.phone,
      address_label: data.address_label,
      complete_address: data.complete_address,
      city: data.city,
      note_to_courier: data.note_to_courier,
      status: data.status
    });
  }

  const [updateShipping, { isLoading: loadingUpdateShipping, isError: isErrorUpdateShipping, isSuccess: isSuccessUpdateShipping }] = useUpdateShippingAddressMutation()
  const handleSaveData = async () => {
    try {
      const response = await updateShipping(formData).unwrap()
      refetch()
      setEditingData(null)
      setMsg(response.msg)
      setDisabledForm({
        status: true,
        shippingId: ''
      })
      setTimeout(() => {
        setMsg('')
      }, 3000);
    } catch (error) {
      console.log(error)
      setMsg(error.data.msg)
    }
  }

  return (
    <>
      {addShipping ?
        <AddShippingAddress close={() => setAddShipping(false)} />
        : null}
      {getShippingLoading || updateStatusShippingLoading || deleteShippingLoading || loadingUpdateShipping ? <LoadingSpinner /> : null}
      {isSuccessUpdateStatusShipping && msg !== '' ||
        isSuccessDelete && msg !== '' ||
        isSuccessUpdateShipping && msg !== '' ?
        < ModalSuccess msg={msg} close={() => setMsg('')} /> : null
      }
      {modalConfirm ? <ModalConfirm onConfirm={handleDeleteData} onCancel={() => setModalConfirm(false)} msg={'Are you sure deleted this data?'} /> : null}
      <div className='overflow-y-scroll h-[40rem] relative'>
        <div className='fixed w-[56.7rem] border-2 bg-white ml-4 self-center rounded-md z-10'>
          <div className='flex justify-start px-2 py-2 self-center'>
            <button
              onClick={() => setAddShipping(true)}
              className='text-white bg-bgSecondaryDark text-sm border px-5 py-1 font-medium rounded-md hover:bg-bgPrimaryDark'>
              Add address
            </button>
          </div>
        </div>
        <div className='mt-12'>
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
                  {
                    isErrorUpdateShipping && msg !== '' && editindData === data._id ?
                      <div className='mb-3'>
                        <AlertErrors msg={msg} close={() => setMsg('')} />
                      </div> : null
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
                        value={editindData === data._id ? formData.recipient_name : data.recipient_name}
                        onChange={handleChangeInput}
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
                        onChange={handleChangeInput}
                        value={editindData === data._id ? formData.phone : data.phone}
                        disabled={disabledForm.status}
                      />
                    </div>
                    <div>
                      <label className={`block mb-2 text-sm font-medium ${!disabledForm.status && disabledForm.shippingId === data._id ? 'text-textPrimary' : 'text-neutral-400'}`}>
                        Address Label *
                      </label>
                      <select
                        name='address_label'
                        id="address_label"
                        className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-64 ${!disabledForm.status && disabledForm.shippingId === data._id ? 'text-textPrimary' : 'text-neutral-400'}`}
                        disabled={disabledForm.status}
                        value={editindData === data._id ? formData.address_label : data.address_label}
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
                      <label className={`block mb-2 text-sm font-medium ${!disabledForm.status && disabledForm.shippingId === data._id ? 'text-textPrimary' : 'text-neutral-400'}`}>
                        Address *
                      </label>
                      <textarea
                        name='complete_address'
                        id='complete_address'
                        className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-80 ${!disabledForm.status && disabledForm.shippingId === data._id ? 'text-textPrimary' : 'text-neutral-400'}`}
                        value={editindData === data._id ? formData.complete_address : data.complete_address}
                        onChange={handleChangeInput}
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
                        value={editindData === data._id ? formData.city : data.city}
                        onChange={handleChangeInput}
                        disabled={disabledForm.status}
                      />
                    </div>
                    <div>
                      <label className={`block mb-2 text-sm font-medium ${!disabledForm.status && disabledForm.shippingId === data._id ? 'text-textPrimary' : 'text-neutral-400'}`}>
                        Note to courier
                      </label>
                      <textarea
                        name='note_to_courier'
                        id='note_to_courier'
                        className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-80 ${!disabledForm.status && disabledForm.shippingId === data._id ? 'text-textPrimary' : 'text-neutral-400'}`}
                        value={editindData === data._id ? formData.note_to_courier : data.note_to_courier}
                        onChange={handleChangeInput}
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
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </button>
                              <button
                                className='text-textPrimary text-sm border px-5 py-1 font-medium rounded-md hover:bg-bgPrimaryDark hover:text-white'
                                onClick={() => handleSaveData(data._id)}
                              >
                                Save
                              </button>
                            </div>
                          </>
                          :
                          <div className='flex gap-2'>
                            <button
                              className={`text-sm border px-5 py-1 font-medium rounded-md ${!disabledForm.status ? 'text-neutral-400' : 'text-textPrimary hover:bg-bgPrimaryDark hover:text-white'} `}
                              onClick={() => handleEditData(data)}
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
      </div>
    </>
  )
}

export default ShippingAddress