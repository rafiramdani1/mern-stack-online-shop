import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useGetProductsQuery } from '../../features/products/productsApiSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/pagination';
import { GrPrevious, GrNext } from "react-icons/gr";
import LoadingSpinner from '../layouts/LoadingSpinner'
import { resetPaginationProduct, selectCurrentColumnProduct, selectCurrentFilterSearchProduct, selectCurrentLimitProduct, selectCurrentMaxPriceProduct, selectCurrentMinPriceProduct, selectCurrentPageProduct, selectCurrentProductRealese, selectCurrentSearchKeywordProduct, selectCurrentSizesProduct, selectCurrentSortDirectionProduct } from '../../features/products/productsSlice'
import 'swiper/css/pagination';
import { CiHeart, CiMail, CiShoppingCart } from 'react-icons/ci'

const ProductsLists = ({ category, limitParams }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(resetPaginationProduct())
  }, [])

  const [searchQuery, setSearchQuery] = useState('')
  const [isHovered, setIsHovered] = React.useState(false);
  const [isHoveredCardIcons, setisHoveredCardIcons] = useState(null)
  const swiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // global state
  const page = useSelector(selectCurrentPageProduct)
  const limit = useSelector(selectCurrentLimitProduct)
  const column = useSelector(selectCurrentColumnProduct)
  const sortDirection = useSelector(selectCurrentSortDirectionProduct)
  const filter_search = useSelector(selectCurrentFilterSearchProduct)
  const searchKeyword = useSelector(selectCurrentSearchKeywordProduct)
  const product_realese = useSelector(selectCurrentProductRealese)
  const minPrice = useSelector(selectCurrentMinPriceProduct)
  const maxPrice = useSelector(selectCurrentMaxPriceProduct)
  const sizes = useSelector(selectCurrentSizesProduct)

  // restructure data for params
  const queryOptions = {
    page,
    limit,
    column: '',
    sortDirection: sortDirection ? 'asc' : 'desc',
    filter_search: searchQuery !== '' ? filter_search : '',
    searchKeyword,
    product_realese,
    minPriceGlobal: minPrice,
    maxPriceGlobal: maxPrice,
    sizes
  }

  // use get products 
  const { data: products, isLoading, refetch } = useGetProductsQuery({
    ...queryOptions,
    limit: limitParams,
    filter_search: 'category.title',
    searchKeyword: category,
    product_realese: 'realese'
  })

  useEffect(() => {
    refetch()
  }, [])

  React.useEffect(() => {
    if (swiperRef.current) {
      const swiperInstance = swiperRef.current.swiper;
      swiperInstance.on('slideChange', () => {
        // Hide/show navigation buttons based on whether swiper is at the beginning or end
        if (prevRef.current && nextRef.current) {
          prevRef.current.style.display = swiperInstance.isBeginning ? 'none' : '';
          nextRef.current.style.display = swiperInstance.isEnd ? 'none' : '';
        }
      });
      // Initialize navigation when hovered
      if (isHovered) {
        swiperInstance.navigation.update();
        swiperInstance.navigation.init();
      } else {
        swiperInstance.navigation.destroy();
      }
      // Initial setup of navigation buttons
      if (prevRef.current && nextRef.current) {
        prevRef.current.style.display = swiperInstance.isBeginning ? 'none' : '';
        nextRef.current.style.display = swiperInstance.isEnd ? 'none' : '';
      }
    }
  }, [isHovered]);

  return (
    <>
      {isLoading ? <LoadingSpinner /> : null}
      <div className='px-36' onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        <div>
          <Swiper
            ref={swiperRef}
            spaceBetween={10}
            centeredSlides={false}
            slidesPerView={4}
            slidesPerGroup={4}
            loop={false}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            pagination={{
              clickable: true,
            }}
            modules={[Navigation, Pagination]}
          >
            {products?.data?.map(product => (
              <SwiperSlide key={product._id}>
                <Link
                  to={`/product/${product.slug}`}
                  className='w-1/4 rounded-md'
                  onMouseEnter={() => setisHoveredCardIcons(product._id)} // Use onMouseEnter and onMouseLeave events
                  onMouseLeave={() => setisHoveredCardIcons(false)}>
                  <div className="w-full rounded-md px-2 pt-2 hover:border hover:border-neutral-200">
                    <div className='flex justify-center'>
                      <img className="h-[25vh] rounded-t-md" src={product.url} alt="product image" />

                      {isHoveredCardIcons === product._id && (
                        <div className={`absolute top-0 left-0 mt-3 shadow-md bg-white border border-t-0 border-r-0 border-b border-neutral-300 rounded-sm animate__animated ${isHoveredCardIcons === product._id ? 'animate__fadeInLeft animate__faster' : 'hidden'}`}>
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
              </SwiperSlide>
            ))}
            {/* Custom navigation buttons */}
            <div ref={prevRef} className={isHovered ? "swiper-button-next top-[35.5%] -left-3.5 absolute z-10 cursor-pointer" : "hidden"}>
              <div className='bg-neutral-50 rounded-xl px-2 py-4 text-neutral-600 hover:text-textPrimary'>
                <GrPrevious className='text-3xl' />
              </div>
            </div>
            <div ref={nextRef} className={isHovered ? "swiper-button-next top-[35.5%] -right-3.5 absolute z-10 cursor-pointer" : "hidden"}>
              <div className='bg-neutral-50 rounded-xl px-2 py-4 text-neutral-600 hover:text-textPrimary'>
                <GrNext className='text-3xl' />
              </div>
            </div>
          </Swiper>
        </div>
      </div>
    </>
  )
}

export default ProductsLists
