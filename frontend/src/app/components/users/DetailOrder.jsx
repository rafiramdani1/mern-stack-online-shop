import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useGetOrderByTransactionIdQuery } from '../../features/order/orderApiSlice'
import axios from 'axios'
import useSnap from '../hooks/useSnap'

const DetailOrder = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const transactionId = queryParams.get('transaction_id')

  const { data: order } = useGetOrderByTransactionIdQuery(transactionId)

  const { snapEmbed } = useSnap()

  useEffect(() => {
    if (order) {
      getSnap()
    }
  }, [order])

  const getSnap = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/transaction/snap/${order.data[0].snap_token}`)

      snapEmbed(response.data.data.token, 'snap-container', {
        onSuccess: function (result) {
          console.log('success', result)
          navigate(`/users/order-status?transaction_id=${response.data.data.transaction_details.order_id}`)
        },
        onPending: function (result) {
          console.log('pending', result)
          navigate(`/users/order-status?transaction_id=${response.data.data.transaction_details.order_id}`)
        },
        onClose: function () {
          navigate(`/users/order-status?transaction_id=${response.data.data.transaction_details.order_id}`)
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='mt-52 px-56'>
      <div className='flex justify-center'>
        <div className='flex justify-between gap-5'>
          <div>
            <h2>Product Information</h2>
          </div>
          <div>
            <div id='snap-container'></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailOrder