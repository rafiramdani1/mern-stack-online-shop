import React from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../features/auth/authSlice'
import { useGetOrderByUserIdQuery } from '../../features/order/orderApiSlice'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'

const PurchaseHistory = () => {

  const user = useSelector(selectCurrentUser)

  const { data: orders } = useGetOrderByUserIdQuery(user?.userId)

  return (
    <div className='px-3'>

      {orders?.data?.length > 0 ? orders?.data.map(item => (
        <div className='border rounded-md p-4 mb-3' key={item._id}>
          <div className='flex mb-5'>
            <h2 className='text-textSecondary text-sm'>{format(item.created_at, "MMMM d, yyyy HH:mm:ss")}</h2>
          </div>
          {item.order_items[0].items.map(item => (
            <div className='flex justify-between self-center items-center' key={item._id}>
              <div className='flex mb-4 gap-3 self-center items-center'>
                <div className='w-24'>
                  <img src={item.product_info.url} />
                </div>
                <div>
                  <h1 className='text-textSecondary font-medium text-sm'>{item.product_info.title}</h1>
                  <div className='flex gap-4'>
                    <h2 className='text-textSecondary font-medium text-sm'>Rp{item.product_info.price.toLocaleString('id', 'ID')}</h2>
                    <h2 className='text-textSecondary text-sm'>x {item.qty}</h2>
                  </div>
                </div>
              </div>
              <div className='flex'>
                <h3 className='text-textSecondary font-medium text-sm'>Rp{item.total.toLocaleString('id', 'ID')}</h3>
              </div>
            </div>
          ))}
          <div className='border-t flex justify-end'>
            <h2 className='my-3 text-textPrimary font-medium text-base'>Subtotal : Rp{item.total.toLocaleString('id', 'ID')}</h2>
          </div>
          <div className='flex justify-between'>
            <h1 className='font-medium text-base bg-red-500 self-center text-white'>{item.status}</h1>
            <Link to={`/users/order_status?transaction_id=${item.transaction_id}`} className='border px-2 py-1 rounded-md bg-bgSecondaryDark text-white hover:bg-bgPrimaryDark'>Detail</Link>
          </div>
        </div>
      )) :
        <div>
          <h2>no transaction data yet</h2>
        </div>
      }
    </div>
  )
}

export default PurchaseHistory