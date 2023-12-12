import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { refreshToken, selectCurrentIsAuth } from '../features/auth/authSlice'
import { Outlet } from 'react-router-dom'

const RefreshToken = () => {

  const dispatch = useDispatch()

  // get isAuth in global state
  const isAuth = useSelector(selectCurrentIsAuth)

  useEffect(() => {
    if (isAuth === 'true') {
      dispatch(refreshToken())
    }
  }, [dispatch])

  return (
    <Outlet />
  )
}

export default RefreshToken