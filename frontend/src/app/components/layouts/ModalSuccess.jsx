import React, { useEffect, useRef } from 'react'
import anime from 'animejs'

const ModalSuccess = ({ msg, close }) => {
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
      <div ref={layoutModalRef} className='fixed flex z-[9999] left-0 top-20 w-full justify-center'>
        <div className='relative bg-white w-full max-w-md max-h-full rounded-lg shadow-lg border border-zinc-300'>
          <div className='py-6'>
            <button onClick={close} type='button' className='absolute right-2.5 top-3'>
              <svg aria-hidden="true" className="w-5 h-5 text-textPrimary hover:text-red-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
            </button>
            <div className='text-center p-3 flex justify-center'>
              <div className='bg-cyan-200 w-fit rounded-full p-2'>
                <i className="uil uil-check text-6xl font-normal text-cyan-500"></i>
              </div>
            </div>
            <h3 className='text-xl text-center mt-3 text-textSecondary font-medium tracking-tight mb-3'>{msg}</h3>
          </div>
        </div>
      </div>
      <div className="opacity-30 fixed inset-0 z-[60] bg-black"></div>
    </>
  )
}

export default ModalSuccess
