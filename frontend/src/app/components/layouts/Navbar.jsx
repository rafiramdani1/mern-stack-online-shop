import React, { useRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { selectCurrentIsAuth, selectCurrentToken, selectCurrentUser, setLogOut } from '../../features/auth/authSlice'
import { useLogoutMutation } from '../../features/auth/authApiSlice'
import { useGetCategoriesQuery } from '../../features/categories/categoriesApiSlice'
import { useGetCartsQuery } from '../../features/cart/cartApiSlice'
import Carts from '../cart/Carts'
import { resetFilterProduct, resetPaginationProduct, resetSearchKeyword, resetSortProduct, selectCurrentPageProduct, setPaginationProduct } from '../../features/products/productsSlice'
import anime from 'animejs'
import { fetchSubCategoriesByCategoryId } from '../../features/sub-categories/subCategoriesSlice'
import { selectCurrentColumnCategories, selectCurrentFilterSearchCategories, selectCurrentLimitCategories, selectCurrentPageCategories, selectCurrentSearchKeywordCategories, selectCurrentSortDirectionCategories } from '../../features/categories/categoriesSlice'
import { IoCartOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";
import { IoIosNotificationsOutline, IoMdArrowDropdown, IoMdArrowRoundDown } from "react-icons/io";
import { CiSettings, CiHeart, CiLogout } from "react-icons/ci";
import { FaRegUserCircle } from 'react-icons/fa'
import { TiClipboard } from "react-icons/ti";
import 'animate.css/animate.min.css';

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const refInputSearch = useRef()
  const refLayoutHistorySearch = useRef(null)

  // local state
  const [showCarts, setShowCarts] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showHistorySearch, setShowHistorySearch] = useState(false)
  const [subCategories, setSubCategories] = useState([])
  const [openDropdowmUser, setOpenDropdownUser] = useState(false)
  const [openDropdowmSubCategory, setOpenDropdowmSubCategory] = useState(null)

  // global state
  const user = useSelector(selectCurrentUser)
  const isAuth = useSelector(selectCurrentIsAuth)
  const token = useSelector(selectCurrentToken)

  // global state categories
  const pageCategory = useSelector(selectCurrentPageCategories)
  const limitCategory = useSelector(selectCurrentLimitCategories)
  const columnCategory = useSelector(selectCurrentColumnCategories)
  const sortDirectionCategory = useSelector(selectCurrentSortDirectionCategories)
  const filterSearchCategory = useSelector(selectCurrentFilterSearchCategories)
  const searchKeywordCategory = useSelector(selectCurrentSearchKeywordCategories)

  const queryOptionsCategories = {
    page: pageCategory,
    limit: limitCategory,
    column: columnCategory,
    sortDirection: sortDirectionCategory ? 'desc' : 'asc',
    filter_search: filterSearchCategory,
    searchKeyword: searchKeywordCategory
  }

  useEffect(() => {
    anime({
      targets: refLayoutHistorySearch.current,
      duration: 2000,
      easing: 'easeInOutSine'
    })
  }, [])

  const [logout, { isLoading }] = useLogoutMutation()
  const { data: categories } = useGetCategoriesQuery(queryOptionsCategories)
  const { data: carts } = useGetCartsQuery()

  const handleShowCarts = () => {
    if (!isAuth || !token || !user) {
      navigate('/login')
    }
    setShowCarts(!showCarts)
  }

  // global state
  const pageProduct = useSelector(selectCurrentPageProduct)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (searchQuery === '') {
      refInputSearch.current.focus()
      return
    }
    setShowHistorySearch(false)
    try {
      await dispatch(setPaginationProduct({ search: searchQuery }))
      dispatch(resetPaginationProduct())
      dispatch(resetSortProduct())
      dispatch(resetFilterProduct())
      dispatch(resetSearchKeyword())
      navigate(`/products/search?q=${searchQuery}`)
      setSearchQuery('')
    } catch (error) {
      console.log(error)
    }
  }

  const handleOpenSubCategories = async (id) => {
    setOpenDropdowmSubCategory(id)
    try {
      const response = await dispatch(fetchSubCategoriesByCategoryId(id))
      setSubCategories(response)
    } catch (error) {
      console.log(error)
    }
  }

  const handleClikToProductByCategory = async (slug) => {
    setOpenDropdowmSubCategory(false)
    dispatch(resetPaginationProduct())
    dispatch(resetSortProduct())
    dispatch(resetFilterProduct())
    dispatch(resetSearchKeyword())
    navigate(`/products/${slug}`)
  }

  const handleClickToProductBySubCategory = async (slug) => {
    setOpenDropdowmSubCategory(false)
    dispatch(resetPaginationProduct())
    dispatch(resetSortProduct())
    dispatch(resetFilterProduct())
    dispatch(resetSearchKeyword())
    navigate(`/products/${slug.category}/${slug.subCategory}`)
  }

  const handleLogout = async (e) => {
    try {
      await logout()
      dispatch(setLogOut())
      window.location.reload()
    } catch (error) {
      return
    }
  }

  return (
    <>
      <div className=''>
        <div className='flex'>
          <div className='flex w-1/3 justify-start self-center'>
            <Link to='/' className='flex'>
              <h1 className='mt-3 font-black text-4xl tracking-tighter text-textPrimary uppercase'>Shoes Store</h1>
            </Link>
          </div>
          <div className='flex w-1/3 justify-center self-center'>
            <form
              onSubmit={handleSearch}
              onMouseLeave={() => setShowHistorySearch(false)}>
              <div className="relative">
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
                  ref={refInputSearch}
                  // onClick={() => setShowHistorySearch(true)}
                  type="search"
                  autoComplete='off'
                  id="default-search"
                  className="block mt-3 w-[25rem] p-4 pl-10 h-10 text-sm text-textPrimary border-2 border-textPrimary rounded-xl bg-bgInput"
                  placeholder="search product"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  required />
              </div>
              <div
                ref={refLayoutHistorySearch}
                className={`${showHistorySearch ? 'absolute bg-white w-[25rem] h-56 shadow-md rounded-md border border-neutral-300' : 'hidden'}`}>
                <div className='p-3'>
                  <div className='flex justify-between'>
                    <h3 className='text-xs'>History</h3>
                    <button className='text-xs'>clear all</button>
                  </div>
                  <div className='mt-2'>
                    <div className='flex justify-between'>
                      <li>tes</li>
                      <button>X</button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className='flex w-1/3 justify-end self-center'>
            <div className=''>
              <ul className='flex'>
                <li className='mr-3'>
                  <div className='relative'>
                    <button
                      onClick={handleShowCarts}
                      title='cart'
                      className='flex cursor-pointer text-textSecondary hover:text-textPrimary'>
                      <IoCartOutline className='text-3xl text-textSecondary' />

                      {/* carts  */}
                      {isAuth ?
                        <input
                          className={carts?.data?.length === 0 ? 'hidden' : 'absolute w-4 text-center left-5 bg-bgPrimaryDark rounded-md font-semibold text-textPrimaryLight text-xs focus: outline-none cursor-pointer'}
                          defaultValue={carts?.data?.length}
                        />
                        : ''
                      }

                    </button>
                  </div>
                </li>
                <li className='mr-3'>
                  <div className='relative'>
                    <button
                      onClick={handleShowCarts}
                      title='cart'
                      className='flex cursor-pointer text-textSecondary hover:text-textPrimary'>
                      <CiHeart className='text-3xl text-textSecondary' />

                      {/* carts  */}
                      {isAuth ?
                        <input
                          className={carts?.data?.length === 0 ? 'hidden' : 'absolute w-4 text-center left-5 bg-bgPrimaryDark rounded-md font-semibold text-textPrimaryLight text-xs focus: outline-none cursor-pointer'}
                          defaultValue={carts?.data?.length}
                        />
                        : ''
                      }

                    </button>
                  </div>
                </li>
                <li className='mr-3'>
                  <div className='relative'>
                    <button
                      onClick={handleShowCarts}
                      title='cart'
                      className='flex cursor-pointer text-textSecondary hover:text-textPrimary'>
                      <IoIosNotificationsOutline className='text-3xl text-textSecondary' />

                      {/* carts  */}
                      {isAuth ?
                        <input
                          className={carts?.data?.length === 0 ? 'hidden' : 'absolute w-4 text-center left-4 bg-bgPrimaryDark rounded-md font-semibold text-textPrimaryLight text-xs focus: outline-none cursor-pointer'}
                          defaultValue={carts?.data?.length}
                        />
                        : ''
                      }

                    </button>
                  </div>
                </li>
                <div className='border border-r border-textPrimaryLight mx-3'></div>
              </ul>
            </div>

            {token || user ?
              <Carts open={showCarts} close={() => setShowCarts(false)} carts={carts} />
              : ""
            }

            <ul className='flex self-center'>
              {token ? (
                <>
                  <FaRegUser
                    onClick={() => setOpenDropdownUser(!openDropdowmUser)}
                    className='text-2xl text-textSecondary cursor-pointer'
                  />
                  {openDropdowmUser ?
                    <div className='bg-neutral-50 shadow-md border w-48 absolute mt-9 p-3.5 right-56 rounded-lg '>
                      <ul className='text-textSecondary font-medium text-sm'>
                        <div className='flex self-center hover:text-textPrimary cursor-pointer'>
                          <FaRegUserCircle className='text-base mr-2' />
                          <li className=''>
                            <Link to={'/users'} onClick={() => localStorage.setItem('activeMenuUserProfile', 'profile')}>{user?.username}</Link>
                          </li>
                        </div>
                        {user?.roleId.roleName === 'admin' ? (
                          <div className='flex self-center hover:text-textPrimary mt-2 cursor-pointer'>
                            <TiClipboard className='text-base mr-2' />
                            <li>
                              <Link to={'/admin/dashboard'}>Dashboard</Link>
                            </li>
                          </div>
                        ) : ''}
                        <div className='flex self-center mt-2 -ml-0.5 hover:text-textPrimary cursor-pointer'>
                          <TiClipboard className='text-xl mr-1.5' />
                          <li className=''>
                            Purchase History</li>
                        </div>
                        <div className='flex self-center mt-2 -ml-0.5 hover:text-textPrimary cursor-pointer'>
                          <CiSettings className='text-xl mr-1.5' />
                          <li className=''>
                            Setting</li>
                        </div>
                        <li>
                          <div className='border my-2 border-neutral-200'></div>
                        </li>
                        <div className='flex self-center mt-2 -ml-0.5 hover:text-textPrimary cursor-pointer'>
                          <CiLogout className='text-xl mr-1.5' />
                          <li>
                            <button onClick={handleLogout} className='hover:text-textPrimary cursor-pointer'>Logout</button>
                          </li>
                        </div>
                      </ul>
                    </div>
                    : ''
                  }
                </>
              ) : (
                <>
                  <li className='mr-3'>
                    <Link to='/login' className='text-sm font-semibold text-textSecondary hover:text-textPrimary cursor-pointer'>LOGIN</Link>
                  </li>
                </>
              )}
            </ul>
          </div>

        </div>
        <div className='flex justify-center mt-7'>
          <ul className='flex gap-6'>
            {categories?.data.map(category => (
              <div key={category._id}>
                <li
                  onMouseEnter={() => handleOpenSubCategories(category._id)}
                  onMouseLeave={() => setOpenDropdowmSubCategory(false)}>
                  {category.title !== 'Others' && category.title !== 'Women Collections' && category.title !== 'Kids Collections' ?
                    <Link
                      to={`/products/${category.slug}`}
                      onClick={() => handleClikToProductByCategory(category.slug)}
                      className='text-textSecondary hover:text-textPrimary font-bold text-sm flex items-center cursor-pointer'>
                      {category.title}
                      <IoMdArrowDropdown className={`text-neutral-500 transition-transform transform ${openDropdowmSubCategory === category._id ? 'rotate-180' : ''}`} />
                    </Link>
                    :
                    <Link
                      to={`/products/${category.slug}`}
                      onClick={() => handleClikToProductByCategory(category.slug)}
                      className='text-textSecondary hover:text-textPrimary font-bold text-sm flex items-center cursor-pointer'>
                      {category.title}
                    </Link>
                  }
                  {openDropdowmSubCategory === category._id && category.title !== 'Others' && category.title !== 'Women Collections' && category.title !== 'Kids Collections' && (
                    <div className={`absolute bg-white shadow-md p-2 w-52 rounded-lg z-10 animate__animated ${openDropdowmSubCategory === category._id ? 'animate__fadeInUp animate__faster	' : 'hidden'}`}>
                      {subCategories?.map(item => (
                        <Link
                          key={item._id}
                          to={`/products/${category.slug}/${item.slug}`}
                          onClick={() => handleClickToProductBySubCategory({ category: category.slug, subCategory: item.slug })}
                          className='block text-textSecondary cursor-pointer hover:text-textPrimary hover:font-medium text-sm p-2'>
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              </div>
            ))}
          </ul>
        </div >
      </div >
    </>
  )
}

export default Navbar
