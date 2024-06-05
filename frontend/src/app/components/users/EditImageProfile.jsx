import React, { useRef, useEffect, useState } from 'react'
import anime from 'animejs'
import { useGetProfileQuery, useUpdateImageProfileMutation } from '../../features/user/userApiSlice'
import LoadingSpinner from '../layouts/LoadingSpinner'
import ModalSuccess from '../layouts/ModalSuccess'
import AlertErrors from '../layouts/AlertErrors'

const EditImageProfile = ({ close, currentImg }) => {
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

  const [imagePreview, setImagePreview] = useState('')
  const [file, setFile] = useState('')
  const [msg, setMsg] = useState('')

  const handleChangeImage = async e => {
    const value = e.target.files[0]
    setFile(value)
    setImagePreview(URL?.createObjectURL(value))
  }

  const { refetch } = useGetProfileQuery()

  const [updateImageProfile, { isLoading, isError, isSuccess }] = useUpdateImageProfileMutation()
  const handleUpdateImage = async e => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('imageId', currentImg._id)
      formData.append('file', file)

      const response = await updateImageProfile(formData).unwrap()
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
      {isSuccess && msg !== '' ? <ModalSuccess msg={msg} close={() => setMsg('')} /> : null}
      <div
        ref={layoutModalRef}
        className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[70] outline-none focus:outline-none">
        <div className="relative w-1/4 my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between px-6 py-4 border-b border-solid border-zinc-200 rounded-t">
              <h3 className="font-semibold text-base md:text-lg text-textPrimary">
                Change Image Profile
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
                <div className='flex justify-center mb-3'>
                  <img src={imagePreview ? imagePreview : currentImg.image_url} alt='preview' className='w-56 h-56 rounded-full border-2 border-textPrimary' />
                </div>

                <div className='flex justify-between'>
                  <div>
                    <input
                      title='change image'
                      type='file'
                      onChange={handleChangeImage}
                    />
                  </div>
                  {
                    imagePreview ?
                      <div>
                        <button
                          onClick={handleUpdateImage}
                          className='text-textPrimary px-3 rounded-md py-1 border-2 text-center font-medium hover:bg-bgPrimaryDark hover:text-white'>Save</button>
                      </div>
                      :
                      <div>
                        <button
                          // onClick={handleUploadImage}
                          className='text-textPrimary px-3 rounded-md py-1 border-2 text-center font-medium hover:bg-bgPrimaryDark hover:text-white'>Delete</button>
                      </div>
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

export default EditImageProfile