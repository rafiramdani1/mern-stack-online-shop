import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { useGetProductsQuery } from '../../features/products/productsApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from '../layouts/LoadingSpinner'
import { RiArrowDropDownLine } from "react-icons/ri";
import { selectCurrentColumnProduct, selectCurrentFilterSearchProduct, selectCurrentLimitProduct, selectCurrentPageProduct, selectCurrentProductRealese, selectCurrentSearchKeywordProduct, selectCurrentSortDirectionProduct, setPaginationProduct } from '../../features/products/productsSlice';

const ProductsSearchResults = () => {
  const location = useLocation();
  const dispatch = useDispatch()
  const searchParams = new URLSearchParams(location.search);
  const q = searchParams.get('q');
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [sort, setSort] = useState('Featured')

  // global state
  const page = useSelector(selectCurrentPageProduct)
  const limit = useSelector(selectCurrentLimitProduct)
  const column = useSelector(selectCurrentColumnProduct)
  const sortDirection = useSelector(selectCurrentSortDirectionProduct)
  const filter_search = useSelector(selectCurrentFilterSearchProduct)
  const searchKeyword = useSelector(selectCurrentSearchKeywordProduct)
  const product_realese = useSelector(selectCurrentProductRealese)

  // restructure data for params
  const queryOptions = {
    page,
    limit,
    column,
    sortDirection: sortDirection ? 'asc' : 'desc',
    filter_search: filter_search,
    searchKeyword,
    product_realese,
  }

  const { data: searchResults, isLoading, status, refetch } = useGetProductsQuery({ ...queryOptions, limit: 100, searchKeyword: q, product_realese: 'realese' })

  const handleClickSort = async (name) => {
    if (name === 'Price : High to Low') {
      dispatch(setPaginationProduct({ sortCol: { column: 'price', sortDirection: false } }))
    } else if (name === 'Price : Low to High') {
      dispatch(setPaginationProduct({ sortCol: { column: 'price', sortDirection: true } }))
    }
    // best sellers
    setSort(name)
    setShowFilter(false)
  }

  return (
    <>
      {isLoading || status === 'pending' ? <LoadingSpinner /> : null}
      <div className='px-36 mt-40'>
        <div className='flex justify-between'>
          <div className='mt-3'>
            <h1 className='ml-2 font-medium text-zinc-700'>Hasil pencarian : {q}</h1>
          </div>
          <div onMouseLeave={() => setShowFilter(false)} className='flex mt-3 items-center'>
            <h3 className='text-textSecondary font-medium mr-2'>Sort :</h3>
            <div onClick={() => setShowFilter(!showFilter)} className='cursor-pointer bg-white border border-neutral-400 px-3 py-1.5 w-48 rounded-md text-sm text-textPrimary font-medium'>
              {sort}
              <div className="pointer-events-none absolute flex items-center px-2 right-[14rem] -mt-5">
                <RiArrowDropDownLine className={`text-2xl text-textPrimary ${showFilter ? 'rotate-180' : ''}`} />
              </div>
            </div>
            <div className={`${showFilter ? 'absolute w-48 border bg-white right-[14rem] mt-[9rem] rounded-md' : 'hidden'}`}>
              <ul className='text-sm text-textSecondary p-2'>
                <li onClick={() => handleClickSort('Price : High to Low')} className={`cursor-pointer py-1 px-1 rounded-sm mb-1 ${sort === 'Price : High to Low' ? 'bg-neutral-300 text-textSecondary' : 'hover:bg-neutral-300 hover:text-textSecondary'}`}>
                  <button className=''>Price : High to Low</button>
                </li>
                <li onClick={() => handleClickSort('Price : Low to High')} className={`cursor-pointer py-1 px-1 rounded-sm mb-1 ${sort === 'Price : Low to High' ? ' bg-neutral-300 text-textSecondary' : 'hover:bg-neutral-300 hover:text-textSecondary'}`}>
                  <button className=''>Price : Low to High</button>
                </li>
                <li onClick={() => handleClickSort('Best sellers')} className={`cursor-pointer py-1 px-1 rounded-sm ${sort === 'Best sellers' ? ' bg-neutral-300 text-textSecondary' : 'hover:bg-neutral-300 hover:text-textSecondary'}`}>
                  <button className=''>Best sellers</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {
          searchResults?.data.length === 0 ?
            <p className='text-center text-zinc-600 mt-4'>Hasil pencarian tidak ditemukan</p>
            : ''
        }
        <div className='flex flex-wrap'>
          {searchResults?.data?.map(product => (
            <Link to={`/product/${product.slug}`} className='w-1/4 rounded-md' key={product._id}>
              <div className="w-full rounded-md bg-white hover:border hover:border-neutral-300 px-2 pt-2 hover:bg-neutral-200">
                <div className='flex justify-center'>
                  <img className="h-[30vh] rounded-t-md" src={product.url} alt="product image" />
                </div>
                <div className="pb-3 mt-3">
                  <h2 className="text-base text-textSecondary font-semibold tracking-tight truncate">{product.title}</h2>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-sm text-textSecondary tracking-tight font-bold">Rp. {(product.price).toLocaleString('id-ID')}</span>
                    <div className="flex items-center">
                      <div className='flex bg-neutral-100 items-center mr-2 px-2.5 py-0.5 rounded-sm'>
                        <span className="text-cyan-800 text-xs font-semibold mr-0.5">5</span>
                        <svg aria-hidden="true" className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>First star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

export default ProductsSearchResults