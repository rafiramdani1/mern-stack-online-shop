import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import NavbarAdmin from './NavbarAdmin'

const Dashboard = () => {

  const [username, setUsername] = useState('')
  const [expired, setExpired] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    refreshToken()
  }, [])

  const refreshToken = async () => {
    try {
      const response = await axios.get('http://localhost:3001/auth/token')
      const decoded = jwtDecode(response.data.accessToken)
      if (decoded.role !== 'admin') return navigate('/')
      setUsername(decoded.username)
      setExpired(decoded.exp)
    } catch (error) {
      if (error.response) {
        navigate('/')
      }
    }
  }

  // refresh token
  const axiosRefresh = axios.create()
  axiosRefresh.interceptors.request.use(async (config) => {
    const currentDate = new Date()
    if (expired * 1000 < currentDate.getTime()) {
      const response = await axios.get('http://localhost:3001/auth/token')
      config.headers.Authorization = `Bearer ${response.data.accessToken}`
      const decoded = jwtDecode(response.data.accessToken)
      if (decoded.role !== 'admin') return navigate('/')
      setUsername(decoded.username)
      setExpired(decoded.exp)
    }
    return config
  }, (error) => {
    return Promise.reject(error)
  })


  return (
    <>
      <NavbarAdmin />
      <section id="category" className="p-4 sm:ml-64 mt-20">
        <div className="container">
          <h1>{username}</h1>
        </div>
      </section>
    </>
  )
}

export default Dashboard
