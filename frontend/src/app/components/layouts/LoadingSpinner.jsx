import React from 'react'

const LoadingSpinner = () => {
  return (
    <>
      <div className='loading flex z-[9999] fixed left-0 right-0 top-0 bottom-0 justify-center'>
        <div className='loading-spinner'></div>
      </div>
      <div className="opacity-40 fixed inset-0 z-[1000] bg-black"></div>
    </>
  )
}

export default LoadingSpinner