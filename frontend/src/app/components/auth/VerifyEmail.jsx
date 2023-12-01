import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { verifyEmail } from '../../features/auth/authSlice'
import { useVerifyEmailAccountQuery } from '../../features/auth/authApiSlice'
import { useGetCategoriesQuery } from '../../features/categories/categoriesApiSlice'
import axios from 'axios'

const VerifyEmail = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id, token } = useParams()
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const verify = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/auth/user/verify/${id}/${token}`)
      setSuccess(response.data.msg)

      setTimeout(() => {
        navigate('/login')
      }, 4000)
    } catch (error) {
      setError(error.response.data.msg)
    }
  }

  useEffect(() => {
    verify()
  }, [])

  return (
    <>
      <section className='flex flex-col items-center justify-center mx-auto max-w-md mt-16'>
        <div className='w-full bg-white rounded-lg border shadow-sm'>


          <div className=''>
            <div className='flex justify-start pt-1 pl-1'>
              <Link to='/login' className='text-4xl text-textPrimary hover:text-textHoverPrimary'><i className="uil uil-arrow-left"></i></Link>
            </div>
            <div className='flex justify-center items-center'>
              <img src='/public/img/cart.png' />
              <h1 className='mt-2 font-semibold text-textPrimary ml-2 text-xl'>Verifikasi</h1>
            </div>

            {success && (
              <div className='bg-green-300 border border-green-500 w-full text-center py-4 rounded-sm mt-4'>
                <h1 className='text-textPrimary font-medium text-base'>{success}!
                  <Link to='/login' className='font-semibold hover:text-textHoverPrimary hover:underline'>{' '}Login</Link>
                </h1>
              </div>
            )}

            {error && (
              <div className='bg-red-300 border border-red-500 w-full text-center py-4 rounded-sm mt-4'>
                <h1 className='text-textPrimary font-medium text-base'>{error}
                </h1>
              </div>
            )}

          </div>
        </div>
      </section >
    </>
  )
}

export default VerifyEmail