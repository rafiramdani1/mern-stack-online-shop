import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useGetSnapOrderByTransactionIdQuery } from '../../features/order/orderApiSlice'
import axios from 'axios'
import useSnap from '../hooks/useSnap'
import { BsArrowDown } from "react-icons/bs";

const DetailOrder = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const transactionId = queryParams.get('transaction_id')
  const [btnPay, setBtnPay] = useState(true)

  const { data: order } = useGetSnapOrderByTransactionIdQuery(transactionId)

  const { snapEmbed } = useSnap()

  // useEffect(() => {
  //   if (order) {
  //     getSnap()
  //   }
  // }, [order])

  const getSnap = async () => {
    setBtnPay(false)
    try {
      const response = await axios.get(`http://localhost:3001/api/transaction/snap/${order?.data[0]?.snap_token}`)

      snapEmbed(response.data.data.token, 'snap-container', {
        onSuccess: function (result) {
          console.log('success', result)
          navigate(`/users/order_status?transaction_id=${response.data.data.transaction_details.order_id}`)
        },
        onPending: function (result) {
          console.log('pending', result)
          setBtnPay(true)
          navigate(`/users/order_status?transaction_id=${response.data.data.transaction_details.order_id}`)
        },
        onClose: function () {
          navigate(`/users/order_status?transaction_id=${response.data.data.transaction_details.order_id}`)
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='mt-52 px-56 mb-20'>
      <div className='flex justify-center'>
        <div className='flex justify-between gap-5'>
          <div>
            <h2 className='text-textSecondary font-bold text-xl'>Product Information</h2>
            <div>
              <h2 className='text-textPrimary text-sm font-medium'>Transaction ID : {order?.data[0]?.transaction_id}</h2>
              {
                order?.data[0]?.order_items[0]?.items.map(item => (
                  <div className='mb-2' key={item._id}>
                    <div className='flex items-center'>
                      <img className='w-48' src={item.product_info.url} />
                      <div>
                        <h3 className='text-textPrimary font-medium tracking-tighter'>{item.product_info.title}</h3>
                        <h3 className='text-textSecondary font-medium text-sm'>Size : {item.size_info.size}</h3>
                        <div className='flex gap-5'>
                          <h3 className='text-textSecondary font-medium text-sm'>Rp{(item.product_info.price).toLocaleString('id', 'ID')}</h3>
                          <h3 className='text-textSecondary font-medium text-sm'>x {item.qty}</h3>
                          <h2 className='text-textSecondary font-medium'>Rp{(item.total).toLocaleString('id', 'ID')}</h2>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
              <div className='mt-5'>
                <h1 className='text-textSecondary font-bold text-xl'>Shipping Address</h1>
              </div>
              <div className='border mt-2 p-3 rounded-sm'>
                <div className='flex w-full gap-20'>
                  <div>
                    <label className='text-textPrimary font-medium'>Reciepent Name :</label>
                    <h3 className='text-textSecondary text-sm'>{order?.data[0]?.shipping_address.recipient_name}</h3>
                  </div>
                  <div>
                    <label className='text-textPrimary font-medium'>Address Label :</label>
                    <h3 className='text-textSecondary text-sm'>{order?.data[0]?.shipping_address.address_label}</h3>
                  </div>
                  <div>
                    <label className='text-textPrimary font-medium'>Phone :</label>
                    <h3 className='text-textSecondary text-sm'>{order?.data[0]?.shipping_address.phone}</h3>
                  </div>
                </div>
                <div className='flex w-full gap-20 mt-3'>
                  <div>
                    <label className='text-textPrimary font-medium'>City :</label>
                    <h3 className='text-textSecondary text-sm'>{order?.data[0]?.shipping_address.city}</h3>
                  </div>
                  <div>
                    <label className='text-textPrimary font-medium'>Complete Address :</label>
                    <h3 className='text-textSecondary text-sm'>{order?.data[0]?.shipping_address.complete_address}</h3>
                  </div>
                </div>
              </div>
              <div className='flex justify-between mt-5'>
                <h1 className='text-white bg-red-500 font-bold'>{order?.data[0]?.status}</h1>
                <h1 className='text-textSecondary font-bold text-xl'>Subtotal : Rp{(order?.data[0]?.total)?.toLocaleString('id', 'ID')}</h1>
              </div>
            </div>
            {
              btnPay ?
                <>
                  <div className='flex justify-center mt-10'>
                    <BsArrowDown className='text-4xl text-textSecondary' />
                  </div>
                  <div className='flex justify-center mt-2'>
                    <button onClick={getSnap} className={`border bg-bgSecondaryDark px-2 py-1 text-white rounded-md hover:bg-bgPrimaryDark`}>Continue Payment</button>
                  </div>
                </>
                : ''
            }
          </div>
          <div>
            <div id='snap-container'></div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default DetailOrder