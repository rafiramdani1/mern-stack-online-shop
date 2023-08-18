import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useContext } from 'react'
import { CategoriesContext } from '../admin/categories/CategoriesContext'
import jwtDecode from 'jwt-decode'

const Navbar = () => {

  const [isLogin, setIsLogin] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showCat, setShowCat] = useState(false)
  const navigate = useNavigate()
  const { getCategories, categories } = useContext(CategoriesContext)

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await axios.get('http://localhost:3001/auth/token')
        setIsLogin(true)
        const decoded = jwtDecode(response.data.accessToken)
        if (decoded.role === 'admin') {
          setIsAdmin(true)
        }
      } catch (error) {
        if (error.response) {
          console.log(error.response.statusText)
        }
      }
    }
    getToken()
    getCategories()
  }, [])


  const Logout = async () => {
    try {
      await axios.delete('http://localhost:3001/auth/logout')
      navigate('/')
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className=''>
      <div className='flex'>
        <div className='flex w-1/2 justify-start'>
          <img src='/img/cart.png' className="w-12 mr-2.5"></img>
          <h1 className='mt-3 font-bold text-xl text-textPrimary'>Shoes Store</h1>
          <div className='mt-3.5 ml-10'>

            <ul className='flex'>
              <li className='mr-4' onMouseOver={() => setShowCat(true)} onMouseOut={() => setShowCat(false)}>
                <a className='text-sm font-semibold text-textSecondary hover:text-textPrimary cursor-pointer mr-4'>Kategori</a>

                <div id="dropdownNavbar" className={showCat ? 'md:absolute z-40 w-full bg-white rounded-md shadow-xl md:w-1/5' : 'hidden'}>
                  <ul className="py-1 text-sm" aria-labelledby="dropdownNavbarButton">
                    {categories.map(category => (
                      <li key={category._id}>
                        <a href={`/products/${category.slug}`} className="block px-4 py-2 text-textSecondary hover:text-white font-normal hover:bg-hoverBgButton">{category.title}</a>
                      </li>
                    ))}
                  </ul>
                </div>

              </li>
              {isAdmin ?
                <li className='mr-4'>
                  <a href='/admin/dashboard' className='text-sm font-semibold text-textSecondary hover:text-textPrimary cursor-pointer mr-4'>Dashboard</a>
                </li>
                : null
              }
            </ul>

          </div>
        </div>
        <div className='flex w-1/2 justify-end'>
          <div className="relative">
            <div className="absolute mt-2 inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
              <svg aria-hidden="true" className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input type="search" id="default-search" className="block mt-3 w-60 md:w-72 lg:w-80 p-4 pl-10 h-6 text-sm text-textPrimary border border-borderInput rounded-lg bg-bgInput focus:ring-focusRingInput focus:border-zinc-600" placeholder="Cari..." required />
            <button type="submit" className="text-white h-7 absolute right-[0.18rem] bottom-[0.38rem] bg-textPrimary border border-borderButton hover:bg-zinc-800 focus:ring-2 focus:outline-none focus:ring-ringFocusBtn font-medium rounded-lg text-xs px-3 py-1">cari</button>
          </div>

          {isLogin ? (
            <div className='mt-1.5 ml-10'>
              <ul className='flex'>
                <li className='mr-3'>
                  <div className='relative'>
                    <a className='flex cursor-pointer text-textSecondary hover:text-textPrimary'>
                      <i className="uil uil-shopping-bag text-4xl font-bold"></i>
                      <input className='absolute w-4 text-center left-5 bg-cyan-400 mt-1 rounded-md font-semibold border border-zinc-400 text-xs focus: outline-none cursor-pointer' readOnly />
                    </a>
                  </div>
                </li>
                <div className='border border-r border-zinc-300 mr-3'></div>
                <li className='mr-3 mt-2'>
                  <a onClick={Logout} className='text-sm font-semibold text-textSecondary hover:text-textPrimary cursor-pointer'>KELUAR</a>
                </li>
              </ul>
            </div>
          ) : (
            <div className='mt-4 ml-10'>
              <ul className='flex'>
                <li className='mr-3'>
                  <a href='/register' className='text-sm font-semibold text-textSecondary hover:text-textPrimary cursor-pointer'>DAFTAR</a>
                </li>
                <li className='mr-3'>
                  <a href='/login' className='text-sm font-semibold text-textSecondary hover:text-textPrimary cursor-pointer'>MASUK</a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
