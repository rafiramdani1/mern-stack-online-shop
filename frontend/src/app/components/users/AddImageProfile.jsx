import React, { useRef, useEffect, useState } from 'react'
import anime from 'animejs'
import { useGetProfileQuery, useUploadImageProfileMutation } from '../../features/user/userApiSlice'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../features/auth/authSlice'
import AlertErrors from '../layouts/AlertErrors'
import ModalSuccess from '../layouts/ModalSuccess'
import LoadingSpinner from '../layouts/LoadingSpinner'

const AddImageProfile = ({ close }) => {

  const user = useSelector(selectCurrentUser)
  const [imagePreview, setImagePreview] = useState('')
  const [file, setFile] = useState('')
  const [msg, setMsg] = useState('')

  const layoutModalRef = useRef(null)
  useEffect(() => {
    anime({
      targets: layoutModalRef.current,
      translateY: 250,
      duration: 500,
      autoplay: true,
      easing: 'easeInOutSine'
    })
  }, [])

  const handleChangeImage = async event => {
    const value = event.target.files[0]
    setFile(value)
    setImagePreview(URL?.createObjectURL(value))
  }

  const handleCloseModal = () => {
    setMsg('')
    close()
  }

  const { refetch } = useGetProfileQuery()

  const [uploadImageUser, { isLoading, isError, isSuccess }] = useUploadImageProfileMutation()
  const handleUploadImage = async event => {
    event.preventDefault()
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await uploadImageUser(formData).unwrap()
      setMsg(response.msg)
      refetch()
      setTimeout(() => {
        close()
        setMsg('')
      }, 3000);
    } catch (error) {
      setMsg(error.data.msg)
    }
  }

  return (
    <>
      {isLoading ? <LoadingSpinner /> : null}
      {isSuccess && msg !== '' ? <ModalSuccess msg={msg} close={handleCloseModal} /> : null}
      <div
        ref={layoutModalRef}
        className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[70] outline-none focus:outline-none">
        <div className="relative w-1/4 my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between px-6 py-4 border-b border-solid border-zinc-200 rounded-t">
              <h3 className="font-semibold text-base md:text-lg text-textPrimary">
                Image Profile
              </h3>
              <button onClick={close}>
                <i className="uil uil-multiply text-textPrimary font-semibold hover:text-red-500"></i>
              </button>
            </div>
            {/*body*/}
            <div className="p-7">
              {
                isError && msg !== '' ?
                  <div>
                    <AlertErrors msg={msg} close={() => setMsg('')} />
                  </div>
                  : null
              }
              <div>
                {
                  imagePreview ? (
                    <div className='flex justify-center mb-3'>
                      <img src={imagePreview} alt='preview' className='w-56 h-56 rounded-full border-2 border-textPrimary' />
                    </div>
                  ) : null
                }
                <div className='flex justify-between'>
                  <div>
                    <input
                      type='file'
                      onChange={handleChangeImage}
                    />
                  </div>
                  {
                    imagePreview ?
                      <div>
                        <button
                          onClick={handleUploadImage}
                          className='text-textPrimary px-3 rounded-md py-1 border-2 text-center font-medium hover:bg-bgPrimaryDark hover:text-white'>Save</button>
                      </div>
                      : null
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-40 fixed inset-0 z-[60] bg-black"></div>
    </>
  )
}

export default AddImageProfile