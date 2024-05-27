import React, { useEffect, useRef } from 'react'
import { FaRegUserCircle } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../features/auth/authSlice'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { useState } from 'react'
import { useGetProfileQuery, useUpdateUserDetailsMutation } from '../../features/user/userApiSlice'
import LoadingSpinner from '../layouts/LoadingSpinner'
import ModalSuccess from '../layouts/ModalSuccess'

const Profile = () => {

  const user = useSelector(selectCurrentUser)

  const [disabledForm, setDisabledForm] = useState(true)
  const [msg, setMsg] = useState('')
  const [formData, setFormData] = useState({
    userId: '',
    username: '',
    fullname: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: ''
  })

  const { data: userProfile, isLoading, refetch, status } = useGetProfileQuery()

  useEffect(() => {
    if (userProfile) {
      setFormData({
        ...formData,
        userId: userProfile._id,
        username: userProfile.username,
        email: userProfile.email,
        fullname: userProfile.user_details.fullname,
        phone: userProfile.user_details.phone,
        dateOfBirth: userProfile.user_details.dateOfBirth,
        gender: userProfile.user_details.gender
      })
    }
  }, [userProfile])

  const handleChangeInput = async event => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleChangeInputDate = async date => {
    setFormData({
      ...formData,
      dateOfBirth: date
    })
  }

  const handleChangeInputSelect = async event => {
    setFormData({
      ...formData,
      gender: event.target.value
    })
  }

  const handleEditData = () => {
    setDisabledForm(prevState => !prevState)
  }

  const [updateUser, { isLoading: updateUserLoading, isError, isSuccess, reset }] = useUpdateUserDetailsMutation()

  const handleSaveEditData = async event => {
    event.preventDefault()
    setDisabledForm(true)
    try {
      const response = await updateUser(formData).unwrap()
      refetch()
      setMsg(response.msg)
      setTimeout(() => {
        setMsg('')
      }, 4000)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {isLoading || updateUserLoading ? <LoadingSpinner /> : null}
      {
        isSuccess && msg !== '' ?
          <ModalSuccess msg={msg} close={() => setMsg('')} />
          : null
      }
      <div className='py-3 px-4'>
        <div className='flex flex-wrap gap-3'>
          <div className='w-1/6'>
            <div className='flex justify-center'>
              <FaRegUserCircle className='text-7xl' />
            </div>
            <div className='text-center mt-2'>
              <button className='text-xs text-textPrimary px-3 rounded-md py-1 border text-center font-medium'>Edit Photo</button>
            </div>
          </div>
          <div>
            <div className='flex gap-4'>
              <div className=''>
                <label className="block mb-2 text-textPrimary text-sm font-medium">
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-64 ${disabledForm ? 'text-neutral-400' : 'text-textPrimary'}`}
                  placeholder="username"
                  value={formData.username}
                  disabled={disabledForm}
                  onChange={handleChangeInput}
                />
              </div>
              <div className=''>
                <label className="block mb-2 text-textPrimary text-sm font-medium">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullname"
                  id="fullname"
                  className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-64 ${disabledForm ? 'text-neutral-400' : 'text-textPrimary'}`}
                  placeholder="fullname"
                  value={formData.fullname}
                  disabled={disabledForm}
                  onChange={handleChangeInput}
                />
              </div>
            </div>
            <div className='flex gap-4 mt-3'>
              <div className=''>
                <label className="block mb-2 text-textPrimary text-sm font-medium">
                  date of birth
                </label>

                <DatePicker
                  className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-64 ${disabledForm ? 'text-neutral-400' : 'text-textPrimary'}`}
                  selected={formData.dateOfBirth}
                  onChange={handleChangeInputDate}
                  disabled={disabledForm}
                />
              </div>
              <div className=''>
                <label className="block mb-2 text-textPrimary text-sm font-medium">
                  Gender
                </label>
                <select
                  id="gender"
                  className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-64 ${disabledForm ? 'text-neutral-400' : 'text-textPrimary'}`}
                  disabled={disabledForm}
                  value={formData.gender}
                  onChange={handleChangeInputSelect}
                >
                  <option value={'-'}>Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
            <h2 className='my-5 text-base font-medium'>Contact</h2>
            <div className='flex gap-4'>
              <div className=''>
                <label className="block mb-2 text-textPrimary text-sm font-medium">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-64 ${disabledForm ? 'text-neutral-400' : 'text-textPrimary'}`}
                  placeholder="email"
                  value={formData.email}
                  disabled={disabledForm}
                  onChange={handleChangeInput}
                />
              </div>
              <div className=''>
                <label className="block mb-2 text-textPrimary text-sm font-medium">
                  Phone *
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-64 ${disabledForm ? 'text-neutral-400' : 'text-textPrimary'}`}
                  placeholder="phone"
                  value={formData.phone}
                  disabled={disabledForm}
                  onChange={handleChangeInput}
                />
              </div>
            </div>
            <div className='mt-7'>
              {
                disabledForm ?
                  <button
                    className='text-textPrimary text-sm border px-5 py-1 font-medium rounded-md hover:bg-bgPrimaryDark hover:text-white'
                    onClick={handleEditData}
                  >
                    Edit Data
                  </button>
                  :
                  <button
                    className='text-textPrimary text-sm border px-5 py-1 font-medium rounded-md hover:bg-bgPrimaryDark hover:text-white'
                    onClick={handleSaveEditData}
                  >
                    Save
                  </button>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile