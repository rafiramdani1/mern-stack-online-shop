import axios from 'axios'
import jwtDecode from 'jwt-decode'
import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AlertErrors from '../Layouts/AlertErrors'

const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = async () => {
      try {
        await axios.get('http://localhost:3001/auth/token')
        navigate('/')
      } catch (error) {
        return
      }
    }
    token()
  }, [])


  const handleChangeEmail = (e) => {
    setEmail(e.target.value)
    setErrors('')
  }

  const handleChangePassword = (e) => {
    setPassword(e.target.value)
    setErrors('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:3001/auth/login', { email, password })
      const decoded = jwtDecode(response.data.accessToken)
      if (decoded.role === 'admin') return navigate('/admin/dashboard')
      navigate('/')
    } catch (error) {
      if (error.response) {
        setErrors(error.response.data.msg)
      }
    }
  }

  return (
    <section className="bg-gray-100">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-textSecondary text-center">
              Masuk
            </h1>
            <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">

              {errors && (<AlertErrors msg={errors} close={() => setErrors('')} />)}

              <div>
                <label className="block mb-2 text-textSecondary text-sm font-medium">
                  Email anda</label>
                <input type="email" name="email" id="email"
                  className="bg-gray-50 border border-gray-300 text-textPrimary sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="name@company.com" value={email} onChange={handleChangeEmail} />
              </div>
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-textSecondary">Password</label>
                <input type="password" name="password" id="password" placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-textPrimary sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" value={password} onChange={handleChangePassword} />
              </div>
              <div className="flex items-center justify-between">
                <a href="/forgot-password"
                  className="text-sm font-medium text-primary-600 hover:underline text-textSecondary">Lupa password?</a>
              </div>
              <button type="submit"
                className="w-full font-medium text-textPrimary hover:text-white hover:bg-hoverBgButton border border-borderButton focus:ring-2 focus:outline-none focus:ring-ringFocusBtn rounded-lg text-sm px-5 py-2.5 text-center mt-5">Masuk</button>
              <p className="text-sm font-light text-gray-500">
                Belum punya akun? <a href="/register"
                  className="font-medium text-primary-600 hover:underline">Daftar</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
