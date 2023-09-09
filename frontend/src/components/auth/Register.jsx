import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../Layouts/Loading'
import AlertErrors from '../Layouts/AlertErrors'

const Register = () => {

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState('')
  const navigate = useNavigate()

  useEffect(() => {

  }, [])

  const handleUsername = (e) => {
    const value = e.target.value
    setUsername(value)
    setErrors('')
  }

  const handleEmail = (e) => {
    const value = e.target.value
    setEmail(value)
    setErrors('')
  }

  const handlePassword = (e) => {
    const value = e.target.value
    setPassword(value)
    setErrors('')
  }

  const handleConfPassword = (e) => {
    const value = e.target.value
    setConfirmPassword(value)
    setErrors('')
  }

  const registerUser = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('http://localhost:3001/auth/register', { username, email, password, confirmPassword })
        .then(result => {
          setUsername('')
          setEmail('')
          setPassword('')
          setConfirmPassword('')
          setSuccess(result.data.msg)
          setTimeout(() => {
            setSuccess('')
            navigate('/login')
          }, 5000)
        }).finally(() => {
          setLoading(false)
        })
    } catch (error) {
      if (error.response) {
        setErrors(error.response.data.msg)
      }
    }
  }

  return (
    <>
      {loading ? <LoadingSpinner /> :
        <section className="bg-gray-100">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-textSecondary text-center">
                  Buat Akun
                </h1>
                <form onSubmit={registerUser} className="space-y-4 md:space-y-6" action="#">

                  {errors && <AlertErrors msg={errors} close={() => setErrors('')} />}

                  {
                    success && (
                      <div className="bg-teal-100 border border-teal-400 text-teal-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">{success}</strong>
                      </div>
                    )
                  }

                  <div>
                    <label
                      className="block mb-2 text-textSecondary text-sm font-medium">Username</label>
                    <input type="username" name="username"
                      className="bg-gray-50 border border-gray-300 text-textPrimary sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      placeholder="username" value={username} onChange={handleUsername} />
                  </div>
                  <div>
                    <label className="block mb-2 text-textSecondary text-sm font-medium">Email</label>
                    <input type="email" name="email"
                      className="bg-gray-50 border border-gray-300 text-textPrimary sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      placeholder="youremail@company" value={email} onChange={handleEmail} />
                  </div>
                  <div>
                    <label
                      className="block mb-2 text-sm font-medium text-textSecondary">Password</label>
                    <input type="password" name="password" placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-textPrimary sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" value={password} onChange={handlePassword} />
                  </div>
                  <div>
                    <label
                      className="block mb-2 text-sm font-medium text-textSecondary">Konfirmasi Password</label>
                    <input type="password" name="password" placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-textPrimary sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" value={confirmPassword} onChange={handleConfPassword} />
                  </div>
                  <button type="submit"
                    className="w-full font-medium text-textPrimary hover:text-white hover:bg-hoverBgButton border border-borderButton focus:ring-2 focus:outline-none focus:ring-ringFocusBtn rounded-lg text-sm px-5 py-2.5 text-center mt-5">Daftar</button>
                  <p className="text-sm font-light text-gray-500">
                    sudah punya akun? <a href="/login"
                      className="font-medium text-primary-600 hover:underline" target="">Masuk</a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      }
    </>
  )
}

export default Register