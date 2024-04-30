import React, { useEffect, useState } from 'react'
import { MdDelete } from 'react-icons/md'
import { FaRegEdit } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const ListSizeProduct = ({ sizeProduct, openModalEdit, openModalDelete }) => {
  return (
    <>
      <div className="relative overflow-x-auto sm:rounded-lg ml-16">
        <table className="w-1/2 text-sm text-left rtl:text-right border-neutral-700">
          <thead className="text-xs text-white uppercase bg-textSecondary">
            <tr>
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-neutral-100 border-neubg-neutral-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-neubg-neutral-800 dark:focus:ring-offset-neubg-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neubg-neutral-600" />
                  <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                </div>
              </td>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
              <th scope="col" className="px-6 py-3">
                <div className='flex items-center'>
                  Sizes
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className='flex items-center'>
                  Stock
                </div>
              </th>
            </tr>
          </thead>
          <tbody className='text-textSecondary'>
            {sizeProduct?.map(item => (
              <tr className="bg-white border-b border-neutral-200" key={item._id}>
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-neutral-100 border-neubg-neutral-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-neubg-neutral-800 dark:focus:ring-offset-neubg-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neubg-neutral-600" />
                    <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                  </div>
                </td>
                <td className="flex px-6 py-4">
                  <a onClick={() => openModalEdit(item._id)} className='mx-1 font-bold' title='edit'>
                    <div className='border bg-textSecondary p-1 rounded-md cursor-pointer hover:bg-cyan-500'>
                      <FaRegEdit className='text-xl font-bold text-white' />
                    </div>
                  </a>
                  <a onClick={() => openModalDelete(item._id)} className='mx-1 cursor-pointer' title='delete'>
                    <div className='border bg-textSecondary p-1 rounded-md cursor-pointer hover:bg-red-500'>
                      <MdDelete className='text-xl font-bold text-white' />
                    </div>
                  </a>
                </td>
                <th scope="row" className="px-6 py-4 font-medium text-textPrimary whitespace-nowrap">
                  {item.size}
                </th>
                <td className="px-6 py-4">
                  {item.stock}
                </td>
              </tr>
            ))}

          </tbody>
        </table>

        {/* if categories data not found */}
        {sizeProduct?.length <= 0 ?
          (<h1 className='w-full text-center relative text-slate-600 font-normal text-base mt-3 mb-3'>Data Not Found</h1>)
          : null}
      </div>
    </>
  )
}

export default ListSizeProduct
