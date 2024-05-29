import anime from 'animejs'
import React, { useEffect, useRef } from 'react'

const AddShippingAddress = ({ close }) => {

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

  return (
    <>
      <div
        ref={layoutModalRef}
        className="justify-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[70] outline-none focus:outline-none">
        <div className="relative w-full my-6 mx-auto max-w-3xl">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between px-6 py-4 border-b border-solid border-zinc-200 rounded-t">
              <h3 className="font-semibold text-base md:text-lg text-textPrimary">
                Form Add Shipping Address
              </h3>
              <button onClick={close}>
                <i className="uil uil-multiply text-textPrimary font-semibold hover:text-red-500"></i>
              </button>
            </div>
            {/*body*/}
            <div className="p-7">
              {/* error message */}
              {/* {isError ?
                <AlertErrors
                  msg={error.data.msg}
                  close={reset}
                />  
                : null
              } */}
              <form action='#'>
                <div className='flex gap-4'>
                  <div>
                    <label className="block mb-2 text-textPrimary text-sm font-medium">
                      recipient's name *
                    </label>
                    <input
                      type="text"
                      name="recipient"
                      id="recipient"
                      className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-52 text-textPrimary`}
                      placeholder="recipient's name"
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
                      className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-52 text-textPrimary`}
                      placeholder="phone"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-textPrimary text-sm font-medium">
                      Address Label *
                    </label>
                    <select
                      id="label_address"
                      className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-64 text-textPrimary`}
                    >
                      <option value={'-'}>Select</option>
                      <option value="House">House</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Boarding House">Boarding House</option>
                      <option value="Office">Office</option>
                    </select>
                  </div>
                </div>
                <div className='flex gap-4 mt-4'>
                  <div>
                    <label className="block mb-2 text-textPrimary text-sm font-medium">
                      Address *
                    </label>
                    <textarea
                      className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-80 text-textPrimary`}
                      placeholder='complete address'>
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
                      className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-40 text-textPrimary`}
                      placeholder="city"
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
                      className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-40 text-textPrimary`}
                      placeholder="postal_code"
                    />
                  </div>
                </div>
                <div className=' flex gap-4 mt-4'>
                  <div>
                    <label className="block mb-2 text-textPrimary text-sm font-medium">
                      Note to courier
                    </label>
                    <textarea
                      className={`bg-bgInput border border-borderInput sm:text-sm rounded-lg focus:ring-focusRingInput focus:border-focusBorderInput p-2 w-80 text-textPrimary`}>
                    </textarea>
                  </div>
                </div>
                <div className='flex justify-between mt-7'>
                  <div className='flex self-cente gap-2'>
                    <input
                      type='checkbox'
                      className='h-5 w-5 cursor-pointer'
                    />
                    <label className='mb-2 text-textPrimary text-sm font-medium'>make it the main address</label>
                  </div>
                  <div>
                    <button
                      className='text-textPrimary text-sm border px-5 py-1 font-medium rounded-md hover:bg-bgPrimaryDark hover:text-white'
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-40 fixed inset-0 z-[60] bg-black"></div>
    </>
  )
}

export default AddShippingAddress