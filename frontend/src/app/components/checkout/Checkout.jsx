import anime from 'animejs'
import React, { useEffect, useRef, useState } from 'react'
import { useGetShippingAddressByUserQuery, useUpdateStatusShippingMutation } from '../../features/user/userApiSlice'
import { IoMdArrowDown, IoMdArrowDropdown } from 'react-icons/io'
import LoadingSpinner from '../layouts/LoadingSpinner'
import ModalSuccess from '../layouts/ModalSuccess'
import axios from 'axios'
import { useGetPaymentTokenMutation } from '../../features/payments/paymentApiSlice'
import { useLocation } from 'react-router-dom'

const Checkout = ({ close, dataCheckout, userShippingAddress }) => {

  const layoutModalRef = useRef(null)
  useEffect(() => {
    anime({
      targets: layoutModalRef.current,
      translateY: 100,
      duration: 500,
      autoplay: true,
      easing: 'easeInOutSine'
    })
  }, [])

  // use get shipping user
  const { refetch } = useGetShippingAddressByUserQuery()

  // local state
  const [dropdownShipping, setDropdownShipping] = useState(false)
  const [msg, setMsg] = useState('')
  const [tokenReqMidtrans, setTokenReqMidtrans] = useState('')

  const shippingStatusTrue = userShippingAddress?.data?.addresses.find(address => address.status === true)

  const [updateStatusShipping, { isLoading, isSuccess, isError }] = useUpdateStatusShippingMutation()
  const handleChangeStatusShipping = async (address) => {
    if (address.status) return
    const data = {
      addressId: address._id,
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

  const handleCloseModalCheckout = async () => {
    window.location.reload()
    close()
  }

  const [paymentToken, { isLoading: isLoadingPayment, isError: isErrorPayment, isSuccess: isSuccessPayment }] = useGetPaymentTokenMutation()
  const handleCheckout = async () => {
    setDropdownShipping(false)
    dataCheckout = {
      ...dataCheckout,
      shipping_address: {
        first_name: shippingStatusTrue?.recipient_name,
        address_label: shippingStatusTrue?.address_label,
        phone: shippingStatusTrue?.phone,
        address: shippingStatusTrue?.complete_address,
        city: shippingStatusTrue?.city,
        note_to_courier: shippingStatusTrue?.note_to_courier
      }
    }
    try {
      const response = await paymentToken(dataCheckout)
      setTokenReqMidtrans(response.data)
      window.snap.embed(response.data,
        {
          embedId: 'snap-container',
          onSuccess: function (result) {
            /* You may add your own implementation here */
            alert("payment success!"); console.log(result);
          },
          onPending: function (result) {
            /* You may add your own implementation here */
            alert("wating your payment!"); console.log(result);
          },
          onError: function (result) {
            /* You may add your own implementation here */
            alert("payment failed!"); console.log(result);
          },
          onClose: function () {
            /* You may add your own implementation here */
            alert('you closed the popup without finishing the payment');
          }
        })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {isLoading || isLoadingPayment ? <LoadingSpinner /> : null}
      {isSuccess && msg !== '' ? <ModalSuccess msg={msg} close={() => setMsg('')} /> : null}
      <div
        ref={layoutModalRef}
        className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[70] outline-none focus:outline-none">
        <div className="relative my-6 mx-auto">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between px-6 py-4 border-b border-solid border-zinc-200 rounded-t">
              <h3 className="font-semibold text-base md:text-lg text-textPrimary">
                Checkout
              </h3>
              <button onClick={handleCloseModalCheckout}>
                <i className="uil uil-multiply text-textPrimary font-semibold hover:text-red-500"></i>
              </button>
            </div>
            {/*body*/}

            <div className="flex p-5 gap-5">
              <div>
                <h1 className='text-textPrimary font-medium mb-3'>Product Info</h1>
                <div className='flex gap-2'>
                  <div>
                    <img src={dataCheckout?.item_details?.productImage} className='w-32' />
                  </div>
                  <div>
                    <h2 className='text-textPrimary tracking-tighter'>{dataCheckout?.item_details?.name}</h2>
                    <div className='flex gap-2 mt-1'>
                      <div>
                        <h3 className='text-textPrimary font-medium'>Rp {(dataCheckout?.item_details?.price).toLocaleString('ID-id')}</h3>
                      </div>
                      <div>
                        <h3 className='text-sm mt-1'>Size : {dataCheckout?.item_details?.size}</h3>
                      </div>
                    </div>
                    <div className='border w-fit px-2 rounded-md mt-2'>
                      <div className='flex'>
                        <button className={'cursor-auto text-base text-neutral-400 font-medium pr-4'}>-</button>
                        <input type='text' className={`text-base font-medium text-slate-500 w-7 text-center focus:outline-none`} value={dataCheckout?.item_details?.quantity} readOnly />
                        <button className={'text-base cursor-auto text-neutral-400 font-medium pl-4'}>+</button>
                      </div>
                    </div>
                  </div>
                </div>
                <h1 className='text-textPrimary font-medium mb-3 mt-3'>Shipping Address</h1>
                <div className='border p-4 rounded-md flex justify-between'>
                  <div>
                    <div className='flex text-sm gap-6 text-textPrimary'>
                      <div>
                        <label className='font-medium'>Recipient name : <span className='font-normal'>{shippingStatusTrue?.recipient_name}</span></label>
                      </div>
                      <div>
                        <label className='font-medium'>Phone : <span className='font-normal'>{shippingStatusTrue?.phone}</span></label>
                      </div>
                      <div>
                        <label className='font-medium'>Address label : <span className='font-normal'>{shippingStatusTrue?.address_label}</span></label>
                      </div>
                    </div>
                    <div className='flex text-sm gap-3 text-textPrimary mt-2'>
                      <div className='w-32'>
                        <label className='font-medium'>City : <span className='font-normal'>{shippingStatusTrue?.city}</span></label>
                      </div>
                      <div className='w-[30rem]'>
                        <label className='font-medium'>Complete address : <span className='font-normal'>{shippingStatusTrue?.complete_address}</span></label>
                      </div>
                    </div>
                    <div className='flex text-sm gap-3 text-textPrimary mt-2'>
                      <label className='font-medium'>Note to courier : <span className='font-normal'>{shippingStatusTrue?.note_to_courier}</span></label>
                    </div>
                  </div>
                  <div className='self-center'>
                    <IoMdArrowDropdown onClick={() => {
                      !tokenReqMidtrans ? setDropdownShipping(!dropdownShipping) : ''
                    }} className={`${dropdownShipping ? '' : '-rotate-90'} ${tokenReqMidtrans ? 'text-neutral-500 cursor-default' : 'cursor-pointer'} text-xl`} />
                  </div>
                </div>
                {
                  dropdownShipping ?
                    <div className='border mt-1 rounded-md ml-3'>
                      {
                        userShippingAddress?.data?.addresses.map(data => (
                          <div className='border p-4 rounded-md flex justify-between' key={data._id}>
                            <div>
                              <div className='flex text-sm gap-6 text-neutral-500'>
                                <div>
                                  <label className='font-medium'>Recipient name : <span className='font-normal'>{data.recipient_name}</span></label>
                                </div>
                                <div>
                                  <label className='font-medium'>Phone : <span className='font-normal'>{data.phone}</span></label>
                                </div>
                                <div>
                                  <label className='font-medium'>Address label : <span className='font-normal'>{data.address_label}</span></label>
                                </div>
                              </div>
                              <div className='flex text-sm gap-3 text-neutral-500 mt-2'>
                                <div className='w-32'>
                                  <label className='font-medium'>City : <span className='font-normal'>{data.city}</span></label>
                                </div>
                                <div className='w-[30rem]'>
                                  <label className='font-medium'>Complete address : <span className='font-normal'>{data.complete_address}</span></label>
                                </div>
                              </div>
                              <div className='flex text-sm gap-3 text-neutral-500 mt-2'>
                                <label className='font-medium'>Note to courier : <span className='font-normal'>{data.note_to_courier}</span></label>
                              </div>
                            </div>
                            <div className='self-center'>
                              <div onClick={() => handleChangeStatusShipping(data)} className={`border rounded-full w-5 h-5 cursor-pointer ${data.status ? 'bg-bgSecondaryDark' : 'hover:border-2 border-textPrimary'}`}>
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                    : null
                }

                <div className='flex justify-center mt-5'>
                  <button onClick={handleCheckout} className={`${tokenReqMidtrans ? 'hidden' : 'border bg-bgSecondaryDark text-white rounded-md py-1.5 px-3 hover:bg-bgPrimaryDark'} `}>Checkout</button>
                </div>
              </div>
              <div className='w-1/2'>
                <div className={tokenReqMidtrans ? 'w-full' : ''} id='snap-container'></div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div className="opacity-40 fixed inset-0 z-[60] bg-black"></div>
    </>
  )
}


export default Checkout