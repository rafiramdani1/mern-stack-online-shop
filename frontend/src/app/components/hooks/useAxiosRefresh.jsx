// import axios from 'axios'
// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { axiosRefresh, refreshTokenUser } from '../../features/auth/authSlice'
// import jwtDecode from 'jwt-decode'

// const useAxiosRefresh = () => {

//   const dispatch = useDispatch()
//   const { token } = useSelector(state => state.auth)
//   const [tokenExp, setTokenExp] = useState('')

//   useEffect(() => {
//     if (token) {
//       const decode = jwtDecode(token)
//       setTokenExp(decode.exp)
//     }
//   }, [token, tokenExp])

//   // const axiosRefresh = axios.create()
//   // axiosRefresh.interceptors.request.use(async (config) => {
//   //   const currentDate = new Date()
//   //   if (tokenExp * 1000 < currentDate.getTime()) {
//   //     const response = await dispatch(refreshTokenUser())
//   //     config.headers.Authorization = `Bearer ${response.payload.token.accessToken}`
//   //   }
//   //   return config
//   // }, (error) => {
//   //   return Promise.reject(error)
//   // })
//   return tokenExp
// }

// export default useAxiosRefresh