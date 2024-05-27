import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../features/auth/authSlice'

const ShippingAddress = () => {

  const user = useSelector(selectCurrentUser)
  const [disabledForm, setDisabledForm] = useState(true)

  const handleSaveData = () => {
    setDisabledForm(true)
    console.log('berhasil diedit')
  }

  return (
    <div className='p-5'>
      <div className='border rounded-md p-4'>
        <div className='flex gap-4'>
          <div>
            <label className="block mb-2 text-textPrimary text-sm font-medium">
              recipient's name *
            </label>
            <input
              type="text"
              name="fullname"
              id="fullname"
              className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-64 ${disabledForm ? 'text-neutral-400' : 'text-textPrimary'}`}
              placeholder="fullname"
              value={'Muhammad Rafi Ramdani'}
              disabled={disabledForm}
            />
          </div>
          <div>
            <label className="block mb-2 text-textPrimary text-sm font-medium">
              Phone *
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-52 ${disabledForm ? 'text-neutral-400' : 'text-textPrimary'}`}
              placeholder="phone"
              value={'0813874584'}
              disabled={disabledForm}
            />
          </div>
          <div>
            <label className="block mb-2 text-textPrimary text-sm font-medium">
              Postal code *
            </label>
            <input
              type="text"
              name="postal_code"
              id="postal_code"
              className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-40 ${disabledForm ? 'text-neutral-400' : 'text-textPrimary'}`}
              placeholder="postal_code"
              value={'2348'}
              disabled={disabledForm}
            />
          </div>
        </div>
        <div className='flex gap-4 mt-4'>
          <div>
            <label className="block mb-2 text-textPrimary text-sm font-medium">
              Address *
            </label>
            <textarea
              className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-80 ${disabledForm ? 'text-neutral-400' : 'text-textPrimary'}`}
              value={'KP KAUM PANGKALAN RT/RW 004/001 Des. Ciptasari Kec. Pangkalan Kab. Karawang'}
              disabled={disabledForm}>
            </textarea>
          </div>
          <div>
            <label className="block mb-2 text-textPrimary text-sm font-medium">
              City *
            </label>
            <input
              type="text"
              name="city"
              id="city"
              className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-40 ${disabledForm ? 'text-neutral-400' : 'text-textPrimary'}`}
              placeholder="city"
              value={'Karawang'}
              disabled={disabledForm}
            />
          </div>
        </div>
        <div className='flex justify-end mt-7'>
          {
            disabledForm ?
              <button
                className='text-textPrimary text-sm border px-5 py-1 font-medium rounded-md hover:bg-bgPrimaryDark hover:text-white'
                onClick={() => setDisabledForm(false)}
              >
                Edit Data
              </button>
              :
              <button
                className='text-textPrimary text-sm border px-5 py-1 font-medium rounded-md hover:bg-bgPrimaryDark hover:text-white'
                onClick={handleSaveData}
              >
                Save
              </button>
          }
        </div>
      </div>
    </div>
  )
}

export default ShippingAddress