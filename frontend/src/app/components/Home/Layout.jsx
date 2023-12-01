import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../layouts/Header'
import { Outlet } from 'react-router-dom'
import { refreshToken, selectCurrentIsAuth } from '../../features/auth/authSlice'

const Layout = () => {

  return (
    <>
      <Header />
      <main className='px-20 mt-32 mb-96'>
        <Outlet />
      </main>
    </>
  )
}

export default Layout