import React, { Fragment, useEffect, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Dialog, Transition } from '@headlessui/react'
import { useDeleteCartMutation, useGetCartsQuery } from '../../features/cart/cartApiSlice'

const Carts = ({ open, close, carts }) => {

  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    if (carts && carts?.data?.length > 0) {
      // Use reduce to sum total price
      const sum = carts.data.reduce((acc, cart) => {
        const productPrice = parseInt(cart.productId?.price);
        return acc + cart.qty * productPrice;
      }, 0);

      setTotalPrice(sum);
    } else {
      setTotalPrice(0)
    }
  }, [carts]);

  const [deleteCart, { isLoading, isSuccess }] = useDeleteCartMutation()
  const { refetch } = useGetCartsQuery()

  const deleteCartProduct = async (idCart) => {
    try {
      const response = await deleteCart(idCart)
      await refetch()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={close}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md mt-14">
                  <div className="flex h-full flex-col overflow-y-scroll shadow-xl bg-white">
                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 ">
                      <div className="flex items-start justify-between mt-24 self-center">
                        <Dialog.Title className="text-lg font-medium text-zinc-800 self-center">
                          <i className="uil uil-shopping-bag text-3xl"></i>Cart</Dialog.Title>

                        <div className="ml-3 flex items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 mt-1 text-gray-400 hover:text-gray-500"
                            onClick={close}
                          >
                            <span className="absolute -inset-0.5" />
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul role="list" className="-my-6 divide-y divide-gray-200">
                            {carts?.data?.map(cart => (
                              <li key={cart._id} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden">
                                  <img
                                    src={cart?.productId?.url}
                                    className="object-center"
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-800">
                                      <h3>
                                        <a href='#' className='text-sm'>{(cart.productId?.title)?.substring(0, 30)}...</a>
                                      </h3>
                                      <p className="ml-4">Rp{(cart?.qty * parseInt(cart.productId?.price)).toLocaleString("id-ID")}</p>
                                    </div>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <p className="text-gray-500">Qty {cart?.qty}</p>

                                    <div className="flex">
                                      <button onClick={() => deleteCartProduct(cart?._id)}
                                        type="button"
                                        className="font-medium text-gray-600 hover:text-red-500"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {carts?.data.length === 0 ?
                          <p className='text-center text-textSecondary font-medium'>No Product in the Cart</p>
                          : ''
                        }
                      </div>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-800">
                        <p>Subtotal</p>
                        <p>Rp{totalPrice && totalPrice.toLocaleString('id-ID')}</p>
                      </div>
                      <div className="mt-6">
                        <a
                          href="#"
                          className="flex items-center justify-center rounded-md border border-transparent bg-gray-300 px-6 py-3 text-base font-medium text-gray-800 shadow-sm hover:bg-gray-400"
                        >
                          Checkout
                        </a>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default Carts