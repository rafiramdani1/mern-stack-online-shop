import axios from 'axios'
import jwtDecode from 'jwt-decode'
import React, { createContext, useState } from 'react'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

  const [isLogin, setIsLogin] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const authNavbar = async () => {
    try {
      const response = await axios.get('http://localhost:3001/auth/token')
      setIsLogin(true)
      const decoded = jwtDecode(response.data.accessToken)
      if (decoded.role === 'admin') {
        setIsAdmin(true)
      }
    } catch (error) {
      if (error.response) {
        return
      }
    }
  }

  return (
    <AuthContext.Provider value={{ authNavbar, isLogin, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}