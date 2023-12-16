import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import NavbarAdmin from '../layouts/NavbarAdmin'
import { selectCurrentIsAuth, selectCurrentToken, selectCurrentUser } from '../../features/auth/authSlice'

const LayoutAdmin = () => {

  const user = useSelector(selectCurrentUser)
  const token = useSelector(selectCurrentToken)
  const isAuth = useSelector(selectCurrentIsAuth)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuth) {
      if (user && user.roleId.roleName !== 'admin') {
        navigate('/')
      }
    } else {
      navigate('/')
    }
  }, [user, isAuth, token])

  return (
    <>
      <NavbarAdmin />
      <main className='p-4 sm:ml-64 mt-20'>
        <Outlet />
      </main>
    </>
  )
}

export default LayoutAdmin