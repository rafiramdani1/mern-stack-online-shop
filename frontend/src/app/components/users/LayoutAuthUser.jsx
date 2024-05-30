import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentIsAuth, selectCurrentToken, selectCurrentUser } from '../../features/auth/authSlice'
import { Outlet, useNavigate } from 'react-router-dom'
import Header from '../layouts/Header'

const LayoutAuthUser = () => {

  const user = useSelector(selectCurrentUser)
  const token = useSelector(selectCurrentToken)
  const isAuth = useSelector(selectCurrentIsAuth)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuth) {
      if (user && !user?.roleId) {
        navigate('/')
      }
    } else {
      navigate('/')
    }
  }, [user, isAuth, token])
  return (
    <>
      <Header />
      <main className=''>
        <Outlet />
      </main>
    </>
  )
}

export default LayoutAuthUser