import React, { Fragment, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { useGetProductsQuery } from '../../features/products/productsApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { resetPaginationProduct, selectCurrentColumnProduct, selectCurrentFilterSearchProduct, selectCurrentLimitProduct, selectCurrentMaxPriceProduct, selectCurrentMinPriceProduct, selectCurrentPageProduct, selectCurrentProductRealese, selectCurrentSearchKeywordProduct, selectCurrentSizesProduct, selectCurrentSortDirectionProduct, selectCurrentSortProduct, setFilterProduct, setPaginationProduct, setSortProduct } from '../../features/products/productsSlice';
import SidebarProductFIlter from '../layouts/SidebarProductFIlter';
import { CiHeart, CiMail, CiShoppingCart } from 'react-icons/ci';
import ReactPaginate from 'react-paginate';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useGetSizesQuery } from '../../features/sizes/sizesApiSlice';
import { useDebounce } from 'use-debounce';

const ProductsSearchResults = () => {
  const location = useLocation();
  const dispatch = useDispatch()
  const searchParams = new URLSearchParams(location.search);
  const q = searchParams.get('q');
  const [isHoveredCardIcons, setisHoveredCardIcons] = useState(null)
  const [openDropdownSort, setOpenDropdownSort] = useState(false)

  const { data: sizes } = useGetSizesQuery()

  // global state
  const page = useSelector(selectCurrentPageProduct)
  const limit = useSelector(selectCurrentLimitProduct)
  const column = useSelector(selectCurrentColumnProduct)
  const sortDirection = useSelector(selectCurrentSortDirectionProduct)
  const filter_search = useSelector(selectCurrentFilterSearchProduct)
  const searchKeyword = useSelector(selectCurrentSearchKeywordProduct)
  const product_realese = useSelector(selectCurrentProductRealese)
  const minPriceGlobal = useSelector(selectCurrentMinPriceProduct)
  const maxPriceGlobal = useSelector(selectCurrentMaxPriceProduct)
  const sizesGlobal = useSelector(selectCurrentSizesProduct)
  const sort = useSelector(selectCurrentSortProduct)

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

  const [minPrice, setMinPrice] = useState(minPriceGlobal)
  const [maxPrice, setMaxPrice] = useState(maxPriceGlobal)
  const [debounceMinPrice] = useDebounce(minPrice.replace(/\D/g, ''), 400)
  const [debounceMaxPrice] = useDebounce(maxPrice.replace(/\D/g, ''), 400)

  const { data: products, isLoading, status, refetch } = useGetProductsQuery({
    ...queryOptions,
    limit: 6,
    searchKeyword: q,
    product_realese: 'realese',
    // searchKeyword: debouncedSearchQuery,
    minPriceGlobal: debounceMinPrice,
    maxPriceGlobal: debounceMaxPrice,
    sizes: sizesGlobal
  })

  useEffect(() => {
    refetch()
  }, [page])

  const handleChangePage = async (selectedPage) => {
    await dispatch(setPaginationProduct({ page: selectedPage.selected }))
  }

  const handleSortData = async (name) => {
    if (name === 'Sort By Price : High to Low') {
      dispatch(resetPaginationProduct())
      dispatch(setSortProduct(name))
      dispatch(setPaginationProduct({
        sortCol: {
          column: 'price', sortDirection: false
        }
      }))
    } else if (name === 'Sort By Price : Low to High') {
      dispatch(resetPaginationProduct())
      dispatch(setSortProduct(name))
      dispatch(setPaginationProduct({
        sortCol: {
          column: 'price', sortDirection: true
        }
      }))
    } else if (name === 'Sort By Latest') {
      dispatch(resetPaginationProduct())
      dispatch(setSortProduct(name))
    } else if (name === 'Sort By Popularity') {
      // by popularity soon
      dispatch(resetPaginationProduct())
      dispatch(setSortProduct('Sort By Latest'))
    }
    setOpenDropdownSort(false)
  }

  const formatNumberPrice = (value) => {
    return Number(value).toLocaleString('id-ID')
  }

  const handleMinPriceChange = (event) => {
    const rawValue = event.target.value
    const numericValue = rawValue.replace(/\D/g, '')
    const formattedValue = formatNumberPrice(numericValue)
    setMinPrice(formattedValue)
    dispatch(setFilterProduct({ minPrice: formattedValue }))
  }
  const handleMaxPriceChange = (event) => {
    const rawValue = event.target.value
    const numericValue = rawValue.replace(/\D/g, '')
    const formattedValue = formatNumberPrice(numericValue)
    setMaxPrice(formattedValue)
    dispatch(setFilterProduct({ maxPrice: formattedValue }))
  }

  const handleSizeChange = (size) => {
    if (sizesGlobal.includes(size)) {
      dispatch(setDeleteSizeProduct(size))
    } else {
      dispatch(setFilterProduct({ size: size }))
    }
  }

  return (
    <>
      <div className='mt-48 px-56 mb-40'>
        <div className='flex gap-3'>
          <div className='w-1/4'>
            <SidebarProductFIlter
              hiddenSearch={'hidden'}
              title={'search results'}
              minPriceGlobal={minPrice}
              handleMinPriceChange={handleMinPriceChange}
              maxPriceGlobal={maxPrice}
              handleMaxPriceChange={handleMaxPriceChange}
              sizes={sizes}
              sizesGlobal={sizesGlobal}
              handleSizeChange={handleSizeChange}
            />
          </div>
          <div className='w-full'>
            <div className='flex justify-between text-sm text-textSecondary font-medium my-2 self-center'>
              <div>
                <h1 className='font-medium text-textPrimary pl-3'>Search results : {q}</h1>
              </div>
              <div className=''>
                <button
                  onClick={() => setOpenDropdownSort(!openDropdownSort)}
                  className='flex items-center border-b-2 border-textSecondary text-base'>
                  {sort}
                  <IoMdArrowDropdown />
                </button>
                <div className={`${openDropdownSort ? 'absolute bg-white w-56 border rounded-sm px-1 py-1 animate__animated animate__fadeInUp animate__faster' : 'hidden'}`}>
                  <ul className=''>
                    <li
                      onClick={() => handleSortData('Sort By Popularity')}
                      className={`hover:bg-neutral-200 p-0.5 cursor-pointer ${sort === 'Sort By Popularity' ? 'bg-neutral-200' : ''}`}>
                      <button className='text-neutral-600 text-sm'>Sort By Popularity</button>
                    </li>
                    <li
                      onClick={() => handleSortData('Sort By Latest')}
                      className={`mt-1 hover:bg-neutral-200 p-0.5 cursor-pointer ${sort === 'Sort By Latest' ? 'bg-neutral-200' : ''}`}>
                      <button className='text-neutral-600 text-sm'>Sort By Latest</button>
                    </li>
                    <li
                      onClick={() => handleSortData('Sort By Price : High to Low')}
                      className={`mt-1 hover:bg-neutral-200 p-0.5 cursor-pointer ${sort === 'Sort By Price : High to Low' ? 'bg-neutral-200' : ''}`}>
                      <button className='text-neutral-600 text-sm'>Sort By Price : High to Low</button>
                    </li>
                    <li
                      onClick={() => handleSortData('Sort By Price : Low to High')}
                      className={`mt-1 hover:bg-neutral-200 p-0.5 cursor-pointer ${sort === 'Sort By Price : Low to High' ? 'bg-neutral-200' : ''}`}>
                      <button className='text-neutral-600 text-sm'>Sort By Price : Low to High</button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className='flex flex-wrap'>
              {products?.data.map(product => (
                <div className='w-1/3 p-2' key={product._id}>
                  <Link
                    onMouseEnter={() => setisHoveredCardIcons(product._id)}
                    onMouseLeave={() => setisHoveredCardIcons(false)}
                    to={`/product/${product.slug}`}
                    className='rounded-md'>
                    <div className="w-full rounded-md px-2 pt-2 hover:border hover:border-neutral-200">
                      <div className='flex justify-center'>
                        <img className="h-[25vh] rounded-t-md" src={product.url} alt="product image" />

                        {isHoveredCardIcons === product._id && (
                          <div className={`absolute mt-0.5 shadow-md bg-white border border-t-0 border-r-0 border-b border-neutral-300 rounded-sm mr-[14.3rem] animate__animated ${isHoveredCardIcons === product._id ? 'animate__fadeInLeft animate__faster' : 'hidden'}`}>
                            <ul className='flex gap-3 px-2'>
                              <li>
                                <CiHeart className='text-3xl' />
                              </li>
                              <li>
                                <CiShoppingCart className='text-3xl' />
                              </li>
                              <li>
                                <CiMail className='text-3xl' />
                              </li>
                            </ul>
                          </div>
                        )}

                      </div>
                      <div className="pb-3 mt-3">
                        <h2 className="text-sm text-textSecondary font-semibold tracking-tight text-center">{((product.title).length > 70) ? ((product.title).substring(0, 70) + '...') : (product.title)}
                        </h2>
                        <div className="flex items-center justify-center mt-2.5">
                          <span className="text-sm text-neutral-500 tracking-tight font-bold">Rp. {(product.price).toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            <div className='flex justify-between'>
              <div>
                <p className='text-neutral-700 font-medium text-sm'>Total Rows : {products?.totalRows} Page : {products?.totalRows ? products?.page + 1 : 0} of {products?.totalPage}</p>
              </div>
              <div>
                <ReactPaginate
                  className='flex px-1'
                  pageCount={Math.min(20, products?.totalPage)}
                  onPageChange={handleChangePage}
                  pageLinkClassName="border bg-neutral-100 px-2 rounded-sm hover:bg-neutral-700 hover:text-white"
                  previousLinkClassName="font-medium text-neutral-700 hover:text-neutral-800 mr-2"
                  nextLinkClassName="font-medium text-neutral-700 hover:text-neutral-800 ml-2"
                  activeLinkClassName="text-white bg-neutral-700"
                  disabledLinkClassName="hidden"
                  forcePage={products?.page}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default ProductsSearchResults