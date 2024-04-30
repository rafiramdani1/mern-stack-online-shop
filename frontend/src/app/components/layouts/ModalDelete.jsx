import React, { useEffect, useRef } from 'react'
import anime from 'animejs'

const ModalDelete = ({ onCancelDelete, onConfirmDelete, msg }) => {
  const layoutModalRef = useRef(null)
  useEffect(() => {
    anime({
      targets: layoutModalRef.current,
      translateY: 250,
      autoplay: true,
      duration: 500,
      easing: 'easeInOutSine'
    })
  }, [])
  return (
    <>
      <div ref={layoutModalRef} className='fixed flex z-[9999] top-20 left-0 w-full justify-center'>
        <div className='relative bg-white w-full max-w-md max-h-full rounded-lg shadow-lg border border-zinc-400'>
          <button onClick={onCancelDelete} type='button' className='absolute right-2.5 top-3'>
            <svg aria-hidden="true" className="w-5 h-5 text-textPrimary hover:text-red-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
          <div className='text-center p-3'>
            <svg aria-hidden="true" className="mx-auto mb-4 mt-6 text-zinc-400 w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h3 className='text-lg text-zinc-700 font-normal mb-2'>Are you sure you want to delete this data?</h3>
            {msg && <p className='text-xs mb-5 font-medium text-textSecondary'>Sub categories of that category will also be deleted</p>}

            <button onClick={onConfirmDelete} data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-2 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
              Yes, I am sure
            </button>
            <button onClick={onCancelDelete} data-modal-hide="popup-modal" type="button" className="text-textPrimary hover:text-white bg-white hover:bg-hoverBgButton focus:ring-2 focus:outline-none focus:ring-ringFocusBtn rounded-lg border border-borderButton text-sm font-medium px-5 py-2.5 focus:z-10 mb-5">No, cancel</button>
          </div>
        </div>
      </div>
      <div className="opacity-30 fixed inset-0 z-[60] bg-black"></div>
    </>
  )
}

export default ModalDelete
