import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { reset } from '../../features/categories/categoriesSlice'

const ModalSuccess = ({ msg, close }) => {

  return (
    <>
      <div className='fixed flex z-[9999] left-0 top-20 w-full justify-center items-center'>
        <div className='relative bg-white w-full max-w-md max-h-full rounded-lg shadow-lg border border-zinc-300'>
          <button onClick={close} type='button' className='absolute right-2.5 top-3'>
            <svg aria-hidden="true" className="w-5 h-5 text-textPrimary hover:text-red-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
          <div className='text-center p-3 flex justify-center'>
            <div className='bg-green-200 w-fit rounded-full p-2'>
              <i className="uil uil-check text-4xl font-normal text-green-500"></i>
            </div>
          </div>
          <h3 className='text-base text-center text-textSecondary font-medium mb-4'>{msg}</h3>
        </div>
      </div>
      <div className="opacity-30 fixed inset-0 z-[60] bg-black"></div>
    </>
  )
}

export default ModalSuccess
