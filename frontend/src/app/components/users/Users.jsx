import React, { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import Profile from './Profile'
import ShippingAddress from './ShippingAddress'
import PurchaseHistory from './PurchaseHistory'
import { useGetProfileQuery } from '../../features/user/userApiSlice'
import LoadingSpinner from '../layouts/LoadingSpinner'
import AddImageProfile from './AddImageProfile'
import EditImageProfile from './EditImageProfile'
import userProfileDefault from '../../../../public/img/default_user.png'
import Header from '../layouts/Header'

const Users = () => {

  const { data: userProfile, isLoading, refetch, status } = useGetProfileQuery()

  const [activeMenu, setActiveMenu] = useState(
    localStorage.getItem('activeMenuUserProfile') || 'profile'
  )
  const [addImg, setAddImg] = useState(false)
  const [editImg, setEditImg] = useState(false)

  const handleChangeMenu = (menu) => {
    setActiveMenu(menu)
    localStorage.setItem('activeMenuUserProfile', menu)
  }

  const handleEditImage = () => {
    if (userProfile) {
      if (userProfile?.user_profile_images?.image_url) {
        setEditImg(true)
      } else {
        setAddImg(true)
      }
    }
  }

  return (
    <>
      {isLoading ? <LoadingSpinner /> : null}
      {addImg ? <AddImageProfile close={() => setAddImg(false)} /> : null}
      {editImg ? <EditImageProfile close={() => setEditImg(false)} currentImg={userProfile?.user_profile_images} /> : null}
      <div className='px-80 mt-48'>
        <div className='flex flex-wrap gap-3 justify-center'>
          <div className='w-1/5 border rounded-md p-3 bg-white h-fit'>
            <div className='flex justify-center mb-2'>
              {
                userProfile?.user_profile_images?.image_url ?
                  <img src={userProfile.user_profile_images.image_url} className='bg-cover rounded-full w-48 h-48' />
                  :
                  <img src={userProfileDefault} className='bg-cover rounded-full w-48 h-48' />
              }
            </div>
            <div className='flex justify-center'>
              <button onClick={handleEditImage} className='text-xs text-textPrimary px-3 rounded-md py-1 border text-center font-medium hover:bg-bgPrimaryDark hover:text-white'>Edit Photo
              </button>
            </div>
            <div className='text-center mt-4'>
              <button className='text-textPrimary text-sm border px-5 py-1 font-medium rounded-md hover:bg-bgPrimaryDark hover:text-white'>Change Password</button>
            </div>
          </div>
          <div className='w-9/12 bg-white'>
            <div className='mb-2'>
              <h2 className='text-base text-textPrimary font-medium'>Muhammad Rafi Ramdani</h2>
            </div>
            <div className='border mb-3 rounded-md'>
              <div className='border-b mb-2'>
                <ul className='flex items-center gap-1 text-sm font-medium text-textSecondary p-1'>
                  <li onClick={() => handleChangeMenu('profile')}>
                    <button className={`hover:text-textPrimary hover:font-bold w-44 py-1 ${activeMenu === 'profile' ? 'border-b-2 border-bgPrimaryDark font-bold text-textPrimary' : ''}`}>Profile</button>
                  </li>
                  <li onClick={() => handleChangeMenu('shipping_address')}>
                    <button className={`hover:text-textPrimary hover:font-bold w-44 py-1 ${activeMenu === 'shipping_address' ? 'border-b-2 border-bgPrimaryDark font-bold text-textPrimary' : ''}`}>Shipping Address</button>
                  </li>
                  <li onClick={() => handleChangeMenu('purchase_history')}>
                    <button className={`hover:text-textPrimary hover:font-bold w-44 py-1 ${activeMenu === 'purchase_history' ? 'border-b-2 border-bgPrimaryDark font-bold text-textPrimary' : ''}`}>Purchase History</button>
                  </li>
                </ul>
              </div>
              <div>
                {activeMenu === 'profile' ? <Profile userProfile={userProfile} />
                  : activeMenu === 'shipping_address' ? <ShippingAddress />
                    : activeMenu === 'purchase_history' ? <PurchaseHistory />
                      : '-'
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  )
}

export default Users