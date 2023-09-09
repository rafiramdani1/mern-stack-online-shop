import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams, Link } from 'react-router-dom'

const VerifyEmail = () => {
  const [data, setData] = useState(null)
  const [errors, setErrors] = useState(null)
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/auth/user/verify/${params.id}/${params.token}`)
      setData(response.data)
      setTimeout(() => {
        navigate('/login')
      }, 5000)
    } catch (error) {
      setErrors(error)
    }
  }

  return (
    <>
      {data && (
        <div className="bg-teal-100 border border-teal-400 text-teal-700 px-4 py-3 rounded relative text-center" role="alert">
          <strong className="font-bold">{data.msg}</strong>
          <Link to='/login'>
            <button className='text-teal-700 hover:text-teal-800 font-medium underline text-center ml-2'><strong>Login</strong></button>
          </Link>
        </div>
      )}
      {errors && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
          <strong className="font-bold">{errors.response.data.msg}</strong>
        </div>
      )}
    </>
  )
}

export default VerifyEmail