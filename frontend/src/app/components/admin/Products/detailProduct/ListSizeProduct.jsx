import React, { useEffect, useState } from 'react'

const ListSizeProduct = ({ sizeProduct, openModalEdit, openModalDelete }) => {
  if (sizeProduct) {
    console.log(sizeProduct)
  }
  return (
    <>
      <div className="relative w-1/2 overflow-x-auto shadow-md sm:rounded-lg ml-16">
        <table className="w-full text-sm text-left text-textContentTable">
          <thead className="text-xs text-textHeadTable uppercase bg-bgTable text-center">
            <tr>
              <th scope="col" className="px-6 py-3">
                Ukuran
              </th>
              <th scope="col" className="px-6 py-3">
                Stok
              </th>
              <th scope="col" className="px-6 py-3">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {sizeProduct?.map(size => (
              <tr className="bg-white border-b text-center" key={size._id}>
                <th scope="row" className="px-6 py-4 font-medium text-textSecondary whitespace-nowrap">
                  {size.size}
                </th>
                <td className="px-6 py-4 font-medium text-textSecondary whitespace-nowrap">
                  {size.stock}
                </td>
                <td className="px-6 py-4 font-medium text-textSecondary whitespace-nowrap">
                  <a onClick={() => openModalEdit(size._id)} className='mx-1 font-semibold hover:text-cyan-500 cursor-pointer'><i className="uil uil-edit text-cyan-500 hover:text-cyan-700"></i></a>
                  <a onClick={() => openModalDelete(size._id)} className='mx-1 font-semibold cursor-pointer'><i className="uil uil-trash-alt text-red-500 hover:text-red-700"></i></a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default ListSizeProduct
