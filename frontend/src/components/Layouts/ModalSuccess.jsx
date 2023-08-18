import React from 'react'

const ModalSuccess = ({ close, msg }) => {
  return (
    <>
      <div className='fixed flex z-[9999] top-20 w-full justify-center'>
        <div className='relative bg-white w-full max-w-md max-h-full rounded-lg shadow-lg border border-zinc-400'>
          <button onClick={close} type='button' className='absolute right-2.5 top-3'>
            <svg aria-hidden="true" className="w-5 h-5 text-textPrimary hover:text-red-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
          <div className='text-center p-3'>
            <svg fill="#06b6d4" className='mx-auto mb-4 mt-6 w-14 h-14' version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52">
              <g>
                <path d="M26,0C11.664,0,0,11.663,0,26s11.664,26,26,26s26-11.663,26-26S40.336,0,26,0z M26,50C12.767,50,2,39.233,2,26
		S12.767,2,26,2s24,10.767,24,24S39.233,50,26,50z" strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' />
                <path d="M38.252,15.336l-15.369,17.29l-9.259-7.407c-0.43-0.345-1.061-0.274-1.405,0.156c-0.345,0.432-0.275,1.061,0.156,1.406
		l10,8C22.559,34.928,22.78,35,23,35c0.276,0,0.551-0.114,0.748-0.336l16-18c0.367-0.412,0.33-1.045-0.083-1.411
		C39.251,14.885,38.62,14.922,38.252,15.336z"  strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' />
              </g>
            </svg>
            <h3 className='text-lg text-textPrimary font-normal mb-4'>{msg}</h3>
          </div>
        </div>
      </div>
      <div className="opacity-30 fixed inset-0 z-[60] bg-black"></div>
    </>
  )
}

export default ModalSuccess
