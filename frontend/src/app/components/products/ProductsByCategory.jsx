import React, { useEffect, useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom';
import { useGetProductByCategorySlugQuery, useGetProductsQuery } from '../../features/products/productsApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { resetPaginationProduct, selectCurrentColumnProduct, selectCurrentFilterSearchProduct, selectCurrentLimitProduct, selectCurrentMaxPriceProduct, selectCurrentMinPriceProduct, selectCurrentPageProduct, selectCurrentProductRealese, selectCurrentSearchKeywordProduct, selectCurrentSizesProduct, selectCurrentSortDirectionProduct, selectCurrentSortProduct, setPaginationProduct, setSortProduct } from '../../features/products/productsSlice';
import { CiHeart, CiMail, CiShoppingCart } from 'react-icons/ci'
import 'animate.css/animate.min.css';
import { IoMdArrowDown, IoMdArrowDropdown } from 'react-icons/io';
import ReactPaginate from 'react-paginate';
import { useDebounce } from 'use-debounce';
import { sizesSlice, useGetSizesQuery } from '../../features/sizes/sizesApiSlice';

const ProductByCategory = () => {

  const { slug } = useParams()
  const dispatch = useDispatch()
  const [title, setTitle] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isHoveredCardIcons, setisHoveredCardIcons] = useState(null)
  const [openDropdownSort, setOpenDropdownSort] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [selectedSizes, setSelectSizes] = useState([])

  const page = useSelector(selectCurrentPageProduct)
  const limit = useSelector(selectCurrentLimitProduct)
  const column = useSelector(selectCurrentColumnProduct)
  const sortDirection = useSelector(selectCurrentSortDirectionProduct)
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
    searchKeyword,
    product_realese,
    minPriceGlobal,
    maxPriceGlobal,
    sizesGlobal
  }
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500)
  const [debounceMinPrice] = useDebounce(minPrice.replace(/\D/g, ''), 400)
  const [debounceMaxPrice] = useDebounce(maxPrice.replace(/\D/g, ''), 400)

  const { data: sizes } = useGetSizesQuery()

  const { data: products, isLoading, status, refetch } = useGetProductByCategorySlugQuery({
    ...queryOptions,
    slug: slug,
    product_realese: 'realese',
    limit: 6,
    searchKeyword: debouncedSearchQuery,
    minPriceGlobal: debounceMinPrice,
    maxPriceGlobal: debounceMaxPrice,
    sizes: selectedSizes
  })

  useEffect(() => {
    if (!isLoading && status !== 'pending') {
      if (products?.data?.length > 0) {
        setTitle(products?.data[0]?.category?.title)
      } else {
        setTitle('Tidak ada product')
      }
    }
  }, [products])

  useEffect(() => {
    refetch()
  }, [page, searchQuery])

  useEffect(() => {
    if (searchQuery) {
      handleSearchData()
    }
  }, [searchQuery])

  const handleChangeSearch = async (e) => {
    e.preventDefault()
    setSearchQuery(e.target.value)
    dispatch(setPaginationProduct({ search: e.target.value }))
  }

  const handleSearchData = async () => {
    await dispatch(setPaginationProduct({ page: 0 }))
  }

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
  }
  const handleMaxPriceChange = (event) => {
    const rawValue = event.target.value
    const numericValue = rawValue.replace(/\D/g, '')
    const formattedValue = formatNumberPrice(numericValue)
    setMaxPrice(formattedValue)
  }

  const handleSizeChange = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectSizes(selectedSizes.filter(s => s !== size))
    } else {
      setSelectSizes([...selectedSizes, size])
    }
  }

  return (
    <>
      <div className='mt-48 px-56 mb-40'>

        <div className='flex gap-3'>
          <div className='w-1/4'>
            <div>
              <h1 className='uppercase bg-neutral-300 p-1 font-medium'>Filter in this category</h1>
            </div>
            <div className='mt-5'>
              <h2 className='border-b-2 border-neutral-400 p-1 mb-1 text-textPrimary text-sm uppercase font-medium'>search</h2>
              <div className='relative'>
                <div className="absolute mt-0.5 inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                  <svg aria-hidden="true" className="w-5 h-5 text-neutral-500 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <form onSubmit={handleSearchData}>
                  <input
                    onChange={handleChangeSearch}
                    value={searchQuery}
                    type="search"
                    autoComplete='off'
                    id="default-search"
                    className="block mt-3 w-[20rem] p-3 pl-10 h-9 text-sm text-textPrimary border-2 border-textPrimary rounded-xl bg-bgInput"
                    placeholder="search product in category"
                    required />
                </form>
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
                  value={minPrice}
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
                  value={maxPrice}
                  onChange={handleMaxPriceChange}
                  id="default-search"
                  className="block mt-3 w-[16rem] p-3 pl-10 h-9 text-sm text-textPrimary border-2 border-textPrimary rounded-xl bg-bgInput"
                  placeholder="Maximum"
                  required />
              </div>
            </div>
            <div className='mt-5'>
              <h2 className='border-b-2 border-neutral-400 p-1 mb-1 text-textPrimary text-sm uppercase font-medium'>Promo</h2>
              <div className='mt-2'>
                <div className="flex items-center mb-4">
                  <input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-neutral-600 bg-gray-100 border-gray-300 rounded focus:ring-neutral-500" />
                  <label htmlFor="default-checkbox" className="ms-2 text-sm text-textSecondary font-medium">Free Shipping</label>
                </div>
                <div className="flex items-center mb-4">
                  <input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-neutral-600 bg-gray-100 border-gray-300 rounded focus:ring-neutral-500" />
                  <label htmlFor="default-checkbox" className="ms-2 text-sm text-textSecondary font-medium">Discount</label>
                </div>
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
                      checked={selectedSizes.includes(size.size)}
                      onChange={() => handleSizeChange(size.size)}
                      className="w-4 h-4 text-neutral-600 bg-gray-100 border-gray-300 rounded focus:ring-neutral-500" />
                    <label htmlFor="default-checkbox" className="ms-2 text-sm text-textSecondary font-medium">{size.size}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='w-full'>
            <div className='flex justify-between text-sm text-textSecondary font-medium my-2 self-center'>
              <div>
                <h1>Home / Nike</h1>
              </div>
              <div className=''>
                <button onClick={() => setOpenDropdownSort(!openDropdownSort)} className='flex items-center border-b-2 border-textSecondary text-base'>{sort}
                  <IoMdArrowDropdown />
                </button>
                <div className={`${openDropdownSort ? 'absolute bg-white w-56 border rounded-sm px-1 py-1 animate__animated animate__fadeInUp animate__faster' : 'hidden'}`}>
                  <ul className=''>
                    <li onClick={() => handleSortData('Sort By Popularity')} className={`hover:bg-neutral-200 p-0.5 cursor-pointer ${sort === 'Sort By Popularity' ? 'bg-neutral-200' : ''}`}>
                      <button className='text-neutral-600 text-sm'>Sort By Popularity</button>
                    </li>
                    <li onClick={() => handleSortData('Sort By Latest')} className={`mt-1 hover:bg-neutral-200 p-0.5 cursor-pointer ${sort === 'Sort By Latest' ? 'bg-neutral-200' : ''}`}>
                      <button className='text-neutral-600 text-sm'>Sort By Latest</button>
                    </li>
                    <li onClick={() => handleSortData('Sort By Price : High to Low')} className={`mt-1 hover:bg-neutral-200 p-0.5 cursor-pointer ${sort === 'Sort By Price : High to Low' ? 'bg-neutral-200' : ''}`}>
                      <button className='text-neutral-600 text-sm'>Sort By Price : High to Low</button>
                    </li>
                    <li onClick={() => handleSortData('Sort By Price : Low to High')} className={`mt-1 hover:bg-neutral-200 p-0.5 cursor-pointer ${sort === 'Sort By Price : Low to High' ? 'bg-neutral-200' : ''}`}>
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

      </div >
    </>
  )
}

export default ProductByCategory

