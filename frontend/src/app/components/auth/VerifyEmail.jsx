import React from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useVerifyEmailAccountQuery } from '../../features/auth/authApiSlice'

const VerifyEmail = () => {

  const navigate = useNavigate()
  const { id, token } = useParams()

  const { data: response, isLoading, isError, error, isSuccess } = useVerifyEmailAccountQuery({ id, token })

  if (response?.status === true) {
    setTimeout(() => {
      navigate('/login')
    }, 4000)
  }

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

            {isSuccess && (
              <div className='bg-green-300 border border-green-500 w-full text-center py-4 rounded-sm mt-4'>
                <h1 className='text-textPrimary font-medium text-base'>{response?.msg}!
                  <Link to='/login' className='font-semibold hover:text-textHoverPrimary hover:underline'>{' '}Login</Link>
                </h1>
              </div>
            )}

            {isError && (
              <div className='bg-red-300 border border-red-500 w-full text-center py-4 rounded-sm mt-4'>
                <h1 className='text-textPrimary font-medium text-base'>{error?.data?.msg}
                </h1>
              </div>
            )}

          </div>
        </div>
      </section>
    </>
  )
}

export default VerifyEmail