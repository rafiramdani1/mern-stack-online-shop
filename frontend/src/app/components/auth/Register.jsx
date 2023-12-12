import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useRegisterMutation } from '../../features/auth/authApiSlice'
import LoadingSpinner from '../layouts/LoadingSpinner'
import ModalSuccess from '../layouts/ModalSuccess'
import AlertErrors from '../layouts/AlertErrors'

const Register = () => {

  const USERNAME_REGEX = /^(?=.{4,})/
  const EMAIL_REGEX = /^.+@.+\..+$/
  const PASSWORD_REGEX = /^(?=.*\d).{6,}$/

  const usernameFocus = useRef()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // state form data
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // state action focus error
  const [validUsername, setValidUsername] = useState(false)
  const [usenameFocus, setUsernameFocus] = useState(false)

  const [validEmail, setValidEmail] = useState(false)
  const [emailFocus, setEmailFocus] = useState(false)

  const [validPassword, setValidPassword] = useState(false)
  const [passwordFocus, setPasswordFocus] = useState(false)

  const [validConfirmPassword, setValidConfirmPassword] = useState(false)
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false)

  const [msgSuccess, setMsgSuccess] = useState('')

  // refresh focus input username active
  useEffect(() => {
    usernameFocus.current.focus()
  }, [])

  // handle onchange input form
  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  // cek input form
  useEffect(() => {
    setValidUsername(USERNAME_REGEX.test(formData.username))
  }, [formData.username])

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(formData.email))
  }, [formData.email])

  useEffect(() => {
    setValidPassword(PASSWORD_REGEX.test(formData.password))
    setValidConfirmPassword(formData.password === formData.confirmPassword)
  }, [formData.password, formData.confirmPassword])

  // use register
  const [register, { isLoading, isError, error, isSuccess, reset }] = useRegisterMutation()

  const handleCloseModalSuccess = () => {
    reset()
    setMsgSuccess('')
    navigate('/login')
  }

  // handle submit register
  const handleOnSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await register(formData).unwrap()
      setMsgSuccess(response.msg)
      setTimeout(() => {
        setMsgSuccess('')
        reset()
        navigate('/login')
      }, 4000);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {/* render loading spinner */}
      {isLoading ? (<LoadingSpinner />) : null}
      {isSuccess && msgSuccess !== '' ? <ModalSuccess msg={msgSuccess} close={handleCloseModalSuccess} /> : null}

      <section>
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-5 space-y-4 md:space-y-6 sm:p-8">
              <div className='flex justify-center'>
                <img src='/public/img/cart.png' />
                <h1 className="text-xl font-bold leading-tight tracking-tight text-textPrimary text-center mt-5 ml-2">
                  Buat Akun
                </h1>
              </div>

              <form onSubmit={handleOnSubmit} className="space-y-4 md:space-y-6" action="#">

                {/* Alert error and succes */}
                {isError && (<AlertErrors msg={error?.data?.msg} close={reset} />)}

                <div>
                  <label
                    className="block mb-2 text-textSecondary text-sm font-medium">Username
                    <span className={validUsername ? 'ml-1 text-green-500 font-bold text-xl' : 'hidden'}>
                      <i className="uil uil-check"></i>
                    </span>
                    <span className={validUsername || !formData.username ? 'hidden' : 'text-red-500 ml-1 font-bold text-xl'}>
                      <i className="uil uil-times"></i>
                    </span>
                  </label>
                  <input
                    ref={usernameFocus}
                    type="username"
                    name="username"
                    required
                    className="bg-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5"
                    placeholder="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    onFocus={() => setUsernameFocus(true)}
                  />
                  <p className={usernameFocus && formData.username && !validUsername ? 'text-red-500 text-xs font-medium mt-1' : 'hidden'}>username minimal 4 karakter</p>
                </div>

                <div>
                  <label className="block mb-2 text-textSecondary text-sm font-medium">Email
                    <span className={validEmail ? 'ml-1 text-green-500 font-bold text-xl' : 'hidden'}>
                      <i className="uil uil-check"></i>
                    </span>
                    <span className={validEmail || !formData.email ? 'hidden' : 'text-red-500 ml-1 font-bold text-xl'}>
                      <i className="uil uil-times"></i>
                    </span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="bg-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5"
                    placeholder="youremail@company"
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => setEmailFocus(true)}
                  />
                  <p className={emailFocus && formData.email && !validEmail ? 'text-red-500 text-xs font-medium mt-1' : 'hidden'}>email tidak valid</p>
                </div>

                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-textSecondary">Password
                    <span className={validPassword ? 'ml-1 text-green-500 font-bold text-xl' : 'hidden'}>
                      <i className="uil uil-check"></i>
                    </span>
                    <span className={validPassword || !formData.password ? 'hidden' : 'text-red-500 ml-1 font-bold text-xl'}>
                      <i className="uil uil-times"></i>
                    </span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    className="bg-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5" value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => setPasswordFocus(true)}
                  />
                  <p className={passwordFocus && formData.password && !validPassword ? 'text-red-500 text-xs font-medium mt-1' : 'hidden'}>minimal 6 karakter, dan gunakan kombinasi angka</p>
                </div>

                <div>
                  <label
                    className="block mb-2 text-sm font-medium text-textSecondary">Konfirmasi Password
                    <span className={validConfirmPassword && confirmPasswordFocus && formData.confirmPassword ? 'ml-1 text-green-500 font-bold text-xl' : 'hidden'}>
                      <i className="uil uil-check"></i>
                    </span>
                    <span className={validConfirmPassword || !formData.confirmPassword ? 'hidden' : 'text-red-500 ml-1 font-bold text-xl'}>
                      <i className="uil uil-times"></i>
                    </span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    required
                    className="bg-bgInput border border-borderInput text-textPrimary sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput block w-full p-2.5" value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onFocus={() => setConfirmPasswordFocus(true)}
                  />
                  <p className={confirmPasswordFocus && formData.confirmPassword && !validConfirmPassword ? 'text-red-500 text-xs font-medium mt-1' : 'hidden'}>konfirmasi password tidak sama</p>

                </div>

                <button
                  type="submit"
                  className={`w-full font-medium text-textPrimary rounded-lg text-sm px-5 py-2.5 text-center mt-5 border-borderButton border ${!validUsername || !validEmail || !validPassword || !validConfirmPassword ? 'opacity-50 cursor-not-allowed' : 'hover:text-white hover:bg-hoverBgButton focus:ring-2 focus:outline-none focus:ring-ringFocusBtn cursor-pointer'}`}
                  disabled={!validUsername || !validEmail || !validPassword || !validConfirmPassword ? true : false}
                >
                  Daftar
                </button>

                <p className="text-sm font-light text-textSecondary">
                  sudah punya akun? <Link to={'/login'}
                    className="font-medium text-textPrimary hover:text-textHoverPrimary hover:underline" target="">Masuk</Link>
                </p>

              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Register