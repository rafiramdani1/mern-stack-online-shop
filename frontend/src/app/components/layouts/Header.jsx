import React from 'react'
import Navbar from './Navbar'

const Header = () => {
  return (
    <>
      <div>
        <header className='top-0 fixed z-50 bg-bgPrimaryDark w-full h-9 border-b border-zinc-300'>
          <div className='flex px-56'>
            <div className='w-1/2 flex justify-start mt-2.5'>
              <h3 className='text-textPrimaryLight text-xs font-normal mr-5'>+255 768 356 890</h3>
              <h3 className='text-textPrimaryLight text-xs font-normal'>shoesStore@shoes.com</h3>
            </div>
            <div className='w-1/2 flex justify-end mt-1.5'>
              <i className="uil uil-instagram text-textPrimaryLight mr-2 text-base font-semibold cursor-pointer hover:text-textSecondaryLight"></i>
              <i className="uil uil-facebook text-textPrimaryLight mr-2 text-base font-semibold cursor-pointer hover:text-textSecondaryLight"></i>
              <i className="uil uil-twitter text-textPrimaryLight mr-2 text-base font-semibold cursor-pointer hover:text-textSecondaryLight"></i>
              <i className="uil uil-youtube text-textPrimaryLight mr-2 text-base font-semibold cursor-pointer hover:text-textSecondaryLight"></i>
            </div>
          </div>
        </header>
        <nav className='fixed z-50 top-9 w-full px-56 py-4 bg-neutral-50'>
          <Navbar />
        </nav>
      </div>
    </>
  )
}

export default Header
