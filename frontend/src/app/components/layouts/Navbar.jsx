import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { selectCurrentIsAuth, selectCurrentToken, selectCurrentUser, setLogOut } from '../../features/auth/authSlice'
import { useLogoutMutation } from '../../features/auth/authApiSlice'
import { useGetCategoriesQuery } from '../../features/categories/categoriesApiSlice'
import { useGetCartsQuery } from '../../features/cart/cartApiSlice'
import Carts from '../cart/Carts'
import { searchProductQuery } from '../../features/products/productsSlice'

const Navbar = () => {

  // local state
  const [showCategories, setShowCategories] = useState(false)
  const [showCarts, setShowCarts] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const refInputSearch = useRef()

  // get global state
  const token = useSelector(selectCurrentToken)
  const user = useSelector(selectCurrentUser)
  const isAuth = useSelector(selectCurrentIsAuth)

  const [logout, { isLoading }] = useLogoutMutation()
  const { data: categories } = useGetCategoriesQuery()
  const { data: carts } = useGetCartsQuery()

  const handleShowCarts = () => {
    if (!isAuth || !token || !user) {
      navigate('/login')
    }
    setShowCarts(!showCarts)
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (searchQuery === '') {
      refInputSearch.current.focus()
      return
    }
    try {
      await dispatch(searchProductQuery(searchQuery))
      navigate(`/products/search?q=${searchQuery}`)
      setSearchQuery('')
    } catch (error) {
      console.log(error)
    }
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
          <div className='flex w-1/2 justify-start'>
            <Link to='/' className='flex'>
              <img src='/img/cart.png' className="w-12 mr-2.5"></img>
              <h1 className='mt-3 font-bold text-xl text-textPrimary'>Shoes Store</h1>
            </Link>
            <div className='mt-3.5 ml-10'>

              <ul className='flex'>
                <li className='mr-4' onClick={() => setShowCategories(true)} onMouseOver={() => setShowCategories(true)} onMouseOut={() => setShowCategories(false)}>
                  <a className='text-sm font-semibold text-textSecondary hover:text-textPrimary cursor-pointer mr-4'>Kategori</a>

                  <div id="dropdownNavbar" className={showCategories ? 'md:absolute z-40 w-full bg-white rounded-md shadow-xl md:w-1/5' : 'hidden'}>
                    <ul className="py-1 text-sm" aria-labelledby="dropdownNavbarButton">
                      {categories?.map(category => (
                        <li key={category._id}>
                          <Link to={`/products?category=${category.slug}`} className="block px-4 py-2 text-textSecondary hover:text-white font-normal hover:bg-hoverBgButton">{category.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>

                {user?.roleId.roleName === 'admin' ? (
                  <li className='mr-4'>
                    <Link to={'/admin/dashboard'} className='text-sm font-semibold text-textSecondary hover:text-textPrimary cursor-pointer mr-4'>Dashboard</Link>
                  </li>
                ) : ''}
              </ul>

            </div>
          </div>
          <div className='flex w-1/2 justify-end'>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <div className="absolute mt-0.5 inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                  <svg aria-hidden="true" className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input
                  ref={refInputSearch}
                  type="search"
                  id="default-search"
                  className="block mt-3 w-60 md:w-72 lg:w-80 p-4 pl-10 h-6 text-sm text-textPrimary border border-borderInput rounded-lg bg-bgInput focus:ring-focusRingInput focus:border-zinc-600"
                  placeholder="Cari..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  required />
                <button type="submit" className="text-white h-7 absolute right-[0.18rem] bottom-[0.19rem] bg-textPrimary border border-borderButton hover:bg-textSecondary focus:ring-2 focus:outline-none focus:ring-ringFocusBtn font-medium rounded-lg text-xs px-3 py-1">cari</button>
              </div>
            </form>

            <div className='mt-1.5 ml-10'>
              <ul className='flex'>
                <li className='mr-3'>
                  <div className='relative'>
                    <button onClick={handleShowCarts} className='flex cursor-pointer text-textSecondary hover:text-textPrimary'>
                      <i className="uil uil-shopping-bag text-4xl font-bold"></i>

                      {/* carts  */}
                      {isAuth ?
                        <input className={carts?.length === 0 ? 'hidden' : 'absolute w-4 text-center left-5 bg-cyan-400 mt-1 rounded-md font-semibold border border-zinc-400 text-xs focus: outline-none cursor-pointer'} defaultValue={carts?.length} />
                        : ''
                      }

                    </button>
                  </div>
                </li>
                <div className='border border-r border-zinc-300 mr-3'></div>
              </ul>
            </div>

            {<Carts open={showCarts} close={() => setShowCarts(false)} carts={carts} />}

            <div className='mt-4 ml-10'>
              <ul className='flex'>
                {token ? (
                  <li className='mr-3'>
                    <button onClick={handleLogout} className='text-sm font-semibold text-textSecondary hover:text-textPrimary cursor-pointer'>LOGOUT</button>
                  </li>
                ) : (
                  <>
                    <li className='mr-3'>
                      <Link to='/register' className='text-sm font-semibold text-textSecondary hover:text-textPrimary cursor-pointer'>DAFTAR</Link>
                    </li>
                    <li className='mr-3'>
                      <Link to='/login' className='text-sm font-semibold text-textSecondary hover:text-textPrimary cursor-pointer'>MASUK</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
