import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import AlertErrors from '../layouts/AlertErrors'
import { useLoginMutation } from '../../features/auth/authApiSlice'
import { setCredentials } from '../../features/auth/authSlice'

const Login = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [login, { isLoading, isError, isSuccess, error, reset }] = useLoginMutation()

  const handleChangeEmail = event => {
    setEmail(event.target.value)
    reset()
  }

  const handleChangePassword = event => {
    setPassword(event.target.value)
    reset()
  }

  const handleOnSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await login({ email, password }).unwrap()
      await dispatch(setCredentials(response))
      setEmail('')
      setPassword('')
      navigate('/')
      window.location.reload()
    } catch (error) {
      setPassword('')
    }
  }

  return (
    <>
      <section>
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <h1 className='text-2xl text-textPrimary font-bold mb-2 tracking-tighter'>Shoes Store</h1>
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">

              <h1 className="text-base font-medium leading-tight text-textSecondary">
                Login your account
              </h1>

              {isError ?
                <AlertErrors msg={error.data.msg} close={reset} />
                : null}

              <form onSubmit={handleOnSubmit} className="space-y-4 md:space-y-6">

                <div>
                  <label className="block mb-2 text-textSecondary text-sm font-medium">
                    Your email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="bg-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5"
                    placeholder="name@company.com"
                    value={email}
                    onChange={handleChangeEmail} />
                </div>

                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-textSecondary">Password</label>
                  <input type="password"
                    name="password"
                    id="password"
                    required
                    placeholder="••••••••"
                    className="bg-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5"
                    value={password}
                    onChange={handleChangePassword} />
                </div>

                <div className="flex items-center justify-between">
                  <a href="/forgot-password"
                    className="text-sm font-medium hover:underline text-textSecondary hover:text-textPrimary">Forget password?</a>
                </div>

                <button type="submit"
                  className="w-full font-medium text-textPrimary hover:text-white hover:bg-hoverBgButton border border-borderButton focus:ring-2 focus:outline-none focus:ring-ringFocusBtn rounded-lg text-sm px-5 py-2.5 text-center mt-5">Login</button>

                <p className="text-sm font-light text-textSecondary">
                  Don't have an account yet? <Link to={'/register'}
                    className="font-medium text-textPrimary hover:underline hover:text-textHoverPrimary">Register</Link>
                </p>

              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Login
