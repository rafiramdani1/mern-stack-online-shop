import React from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentSearchKeyWordProduct } from '../../features/products/productsSlice'

const SidebarProductFIlter = ({
  handleChangeSearch,
  searchKeyword,
  minPriceGlobal,
  handleMinPriceChange,
  maxPriceGlobal,
  handleMaxPriceChange,
  sizes,
  sizesGlobal,
  handleSizeChange,
  hiddenSearch,
  title,
}) => {

  return (
    <div>
      <div>
        <h1 className='uppercase bg-neutral-300 p-1 font-medium'>Filter in this {title || 'category'}</h1>
      </div>
      <div className={`mt-5 ${hiddenSearch || ''}`}>
        <h2 className='border-b-2 border-neutral-400 p-1 mb-1 text-textPrimary text-sm uppercase font-medium'>search</h2>
        <div className='relative'>
          <div className="absolute mt-0.5 inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-neutral-500 mb-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z">
              </path>
            </svg>
          </div>
          <input
            onChange={handleChangeSearch}
            value={searchKeyword}
            type="search"
            autoComplete='off'
            id="default-search"
            className="block mt-3 w-[20rem] p-3 pl-10 h-9 text-sm text-textPrimary border-2 border-textPrimary rounded-xl bg-bgInput"
            placeholder="search product in category"
            required />
        </div>
      </div>
      <div className='mt-5'>
        <h2 className='border-b-2 border-neutral-400 p-1 mb-1 text-textPrimary text-sm uppercase font-medium'>Price</h2>
        <div className='relative'>
          <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
            <h2 className='text-sm text-textSecondary font-bold'>Rp</h2>
          </div>
          <input
            type="search"
            autoComplete='off'
            value={minPriceGlobal}
            onChange={handleMinPriceChange}
            id="default-search"
            className="block mt-3 w-[16rem] p-3 pl-10 h-9 text-sm text-textPrimary border-2 border-textPrimary rounded-xl bg-bgInput"
            placeholder="Minimum"
            required />
        </div>
        <div className='relative'>
          <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
            <h2 className='text-sm text-textSecondary font-bold'>Rp</h2>
          </div>
          <input
            type="search"
            autoComplete='off'
            value={maxPriceGlobal}
            onChange={handleMaxPriceChange}
            id="default-search"
            className="block mt-3 w-[16rem] p-3 pl-10 h-9 text-sm text-textPrimary border-2 border-textPrimary rounded-xl bg-bgInput"
            placeholder="Maximum"
            required />
        </div>
      </div>
      <div className='mt-5'>
        <h2 className='border-b-2 border-neutral-400 p-1 mb-1 text-textPrimary text-sm uppercase font-medium'>By Size</h2>
        <div className='mt-2'>
          {sizes?.map(size => (
            <div className="flex items-center mb-4" key={size._id}>
              <input
                id="default-checkbox"
                type="checkbox"
                value={size.size}
                checked={sizesGlobal.includes(size.size)}
                onChange={() => handleSizeChange(size.size)}
                className="w-4 h-4 text-neutral-600 bg-gray-100 border-gray-300 rounded focus:ring-neutral-500" />
              <label
                htmlFor="default-checkbox"
                className="ms-2 text-sm text-textSecondary font-medium">
                {size.size}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className='mt-5'>
        <h2 className='border-b-2 border-neutral-400 p-1 mb-1 text-textPrimary text-sm uppercase font-medium'>Promo</h2>
        <div className='mt-2'>
          <div className="flex items-center mb-4">
            <input
              id="default-checkbox"
              type="checkbox"
              value=""
              className="w-4 h-4 text-neutral-600 bg-gray-100 border-gray-300 rounded focus:ring-neutral-500"
            />
            <label
              htmlFor="default-checkbox"
              className="ms-2 text-sm text-textSecondary font-medium">
              Free Shipping
            </label>
          </div>
          <div className="flex items-center mb-4">
            <input
              id="default-checkbox"
              type="checkbox"
              value=""
              className="w-4 h-4 text-neutral-600 bg-gray-100 border-gray-300 rounded focus:ring-neutral-500"
            />
            <label
              htmlFor="default-checkbox"
              className="ms-2 text-sm text-textSecondary font-medium">
              Discount
            </label>
          </div>
        </div>
      </div>
    </div >
  )
}

export default SidebarProductFIlter