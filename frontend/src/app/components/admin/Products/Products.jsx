import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useDeleteProductMutation, useGetProductsQuery, useGetRealeseStatusQuery } from '../../../features/products/productsApiSlice'
import LoadingSpinner from '../../layouts/LoadingSpinner'
import ModalDelete from '../../layouts/ModalDelete'
import ModalSuccess from '../../layouts/ModalSuccess'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoMdAdd, IoIosAddCircle } from "react-icons/io";
import ReactPaginate from 'react-paginate'
import { format } from 'date-fns'
import { useDebounce } from 'use-debounce'
import { selectCurrentColumnProduct, selectCurrentFilterSearchProduct, selectCurrentLimitProduct, selectCurrentMaxPriceProduct, selectCurrentMinPriceProduct, selectCurrentPageProduct, selectCurrentProductRealese, selectCurrentSearchKeywordProduct, selectCurrentSizesProduct, selectCurrentSortDirectionProduct, setPaginationProduct, updateProductRealese } from '../../../features/products/productsSlice'
import ModalConfirm from '../../layouts/ModalConfirm'

const Products = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // locale state
  const [showModalDelete, setShowModalDelete] = useState(false)
  const [idProduct, setIdProduct] = useState(null)
  const [msgSuccess, setMsgSuccess] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [filter, setFilter] = useState('All Field')
  const [searchQuery, setSearchQuery] = useState('')
  const [errorSizeProduct, setErrorSizeProduct] = useState('')

  // global state
  const page = useSelector(selectCurrentPageProduct)
  const limit = useSelector(selectCurrentLimitProduct)
  const column = useSelector(selectCurrentColumnProduct)
  const sortDirection = useSelector(selectCurrentSortDirectionProduct)
  const filter_search = useSelector(selectCurrentFilterSearchProduct)
  const searchKeyword = useSelector(selectCurrentSearchKeywordProduct)
  const product_realese = useSelector(selectCurrentProductRealese)
  const minPriceGlobal = useSelector(selectCurrentMinPriceProduct)
  const maxPriceGlobal = useSelector(selectCurrentMaxPriceProduct)
  const sizesGlobal = useSelector(selectCurrentSizesProduct)

  // restructure data for params
  const queryOptions = {
    page,
    limit,
    column,
    sortDirection: sortDirection ? 'asc' : 'desc',
    filter_search: searchQuery !== '' ? filter_search : '',
    searchKeyword,
    product_realese,
    minPriceGlobal,
    maxPriceGlobal,
    sizes: sizesGlobal
  }

  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  // use get products
  const { data: products, isLoading, status, refetch } = useGetProductsQuery(
    { ...queryOptions, searchKeyword: debouncedSearchQuery, limit: 6 }
  )

  useEffect(() => {
    refetch()
  }, [page, searchKeyword])

  useEffect(() => {
    if (searchQuery) {
      handleSearchData()
    }
  }, [searchQuery]);

  const handleChangePage = async (selectedPage) => {
    await dispatch(setPaginationProduct({ page: selectedPage.selected }))
  };

  const handleClickSort = async (name) => {
    if (name === 'title') {
      dispatch(setPaginationProduct({ sortCol: 'title' }))
    } else if (name === 'slug') {
      dispatch(setPaginationProduct({ sortCol: 'slug' }))
    } else if (name === 'category') {
      dispatch(setPaginationProduct({ sortCol: 'category.title' }))
    } else if (name === 'subCategory') {
      dispatch(setPaginationProduct({ sortCol: 'sub_category.title' }))
    } else if (name === 'price') {
      dispatch(setPaginationProduct({ sortCol: 'price' }))
    } else if (name === 'product_realese') {
      dispatch(setPaginationProduct({ sortCol: 'product_realese' }))
    } else if (name === 'createdAt') {
      dispatch(setPaginationProduct({ sortCol: 'created_at' }))
    }
  }

  const handleFilterSearch = async (name) => {
    if (name === 'All Field') {
      setFilter('All Field')
      dispatch(setPaginationProduct({ filter: 'all' }))
    } else if (name === 'Product Title') {
      setFilter('Product Title')
      dispatch(setPaginationProduct({ filter: 'title' }))
    } else if (name === 'Slug') {
      setFilter('Slug')
      dispatch(setPaginationProduct({ filter: 'slug' }))
    } else if (name === 'Category') {
      setFilter('Category')
      dispatch(setPaginationProduct({ filter: 'category.title' }))
    } else if (name === 'Sub Category') {
      setFilter('Sub Category')
      dispatch(setPaginationProduct({ filter: 'sub_category.title' }))
    } else {
      setFilter('All Field')
      dispatch(setPaginationProduct({ filter: 'all' }))
    }
    setShowFilter(false)
  }

  const handleChangeSearch = (e) => {
    setSearchQuery(e.target.value);
    // Tambahkan kondisi untuk melakukan pencarian langsung tanpa menunggu submit
    if (e.target.value === '') {
      dispatch(setPaginationProduct({ search: '' }))
    }
  }

  const handleSearchData = async () => {
    await dispatch(setPaginationProduct({ page: 0 }))
  }

  const handleChangeProductRelease = (productId) => async (e) => {
    const data = {
      productId,
      statusRealeseId: e.target.value
    }

    const editStatusProduct = await dispatch(updateProductRealese(data))
    if (editStatusProduct?.error?.data?.msg?.typeError === 'size product not found') {
      setErrorSizeProduct(editStatusProduct.error.data.msg.msg)
      setIdProduct(data.productId)
    }

    if (editStatusProduct?.data?.status === true) {
      setMsgSuccess(editStatusProduct.data.msg)
      await refetch()
    }
  }

  const handleConfirmAddSizeProduct = async () => {
    navigate(`/admin/dashboard/products/detail/${idProduct}`)
  }

  // handle click delete
  const handleClickDelete = idProduct => {
    setIdProduct(idProduct)
    setShowModalDelete(true)
  }

  // use get realese status
  const { data: statusRealeses } = useGetRealeseStatusQuery()

  // use delete product
  const [deleteProduct, { isLoading: loadingDeleteProduct, isSuccess, reset }] = useDeleteProductMutation()

  // handle confirm delete product
  const handleDeleteProduct = async event => {
    event.preventDefault()
    try {
      const response = await deleteProduct(idProduct)
      setMsgSuccess(response.data.msg)
      // call refetch data
      await refetch()

      setShowModalDelete(false)
      // close modal success
      setTimeout(() => {
        setMsgSuccess('')
        reset()
      }, 2000)
    } catch (error) {
      return
    }
  }

  return (
    <>
      {isLoading || status === 'pending' ? <LoadingSpinner /> : null}
      {loadingDeleteProduct ? <LoadingSpinner /> : null}

      {errorSizeProduct !== '' ?
        <ModalConfirm
          msg={errorSizeProduct}
          onCancel={() => setErrorSizeProduct('')}
          onConfirm={handleConfirmAddSizeProduct} />
        : null
      }

      {showModalDelete ?
        <ModalDelete
          onConfirmDelete={handleDeleteProduct}
          onCancelDelete={() => setShowModalDelete(false)} />
        : null
      }

      {isSuccess && msgSuccess !== '' ?
        <ModalSuccess
          msg={msgSuccess}
          close={reset} />
        : null
      }

      {msgSuccess !== '' ?
        <ModalSuccess
          msg={msgSuccess}
          close={() => setMsgSuccess('')} />
        : null
      }

      <div className="w-full px-2">
        <div className="flex justify-between">
          <div>
            <Link
              to={'/admin/dashboard/products/add-product'}
              className='flex items-center text-textPrimary hover:text-white border border-borderButton hover:bg-hoverBgButton focus:ring-2 focus:outline-none focus:ring-ringFocusBtn font-medium rounded-md text-xs md:text-sm px-4 py-2 text-center mr-2 mb-3'
              title='add'>
              <IoMdAdd className='text-xl' />
            </Link>
          </div>
          <div className='flex w-1/3'>
            <button
              onClick={() => setShowFilter(!showFilter)}
              id="dropdown-button"
              data-dropdown-toggle="dropdown"
              className="flex-shrink-0 h-[4.2vh] z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-textPrimary bg-neutral-100 border border-neutral-300 rounded-s-lg hover:bg-neutral-200 focus:ring-4 focus:outline-none focus:ring-neutral-100"
              type="button">
              {filter}
              <svg
                className="w-2.5 h-2.5 ms-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            <div
              id="dropdown"
              className={`z-10 absolute mt-12 bg-white divide-y divide-neutral-100 rounded-lg shadow-md w-44 ${showFilter ? 'block' : 'hidden'}`}>
              <ul
                className="py-2 text-sm text-neutral-700"
                aria-labelledby="dropdown-button">
                <li>
                  <button
                    type="button"
                    className={`${filter === 'All Field' ? 'inline-flex w-full px-4 py-2 hover:bg-neutral-200 bg-neutral-200' : 'inline-flex w-full px-4 py-2 hover:bg-neutral-200'}`}
                    onClick={() => handleFilterSearch('All Field')}>
                    All Field
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={`${filter === 'Product Title' ? 'inline-flex w-full px-4 py-2 hover:bg-neutral-200 bg-neutral-200' : 'inline-flex w-full px-4 py-2 hover:bg-neutral-200'}`}
                    onClick={() => handleFilterSearch('Product Title')}>
                    Product Title
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={`${filter === 'Slug' ? 'inline-flex w-full px-4 py-2 hover:bg-neutral-200 bg-neutral-200' : 'inline-flex w-full px-4 py-2 hover:bg-neutral-200'}`}
                    onClick={() => handleFilterSearch('Slug')}>
                    Slug
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={`${filter === 'Category' ? 'inline-flex w-full px-4 py-2 hover:bg-neutral-200 bg-neutral-200' : 'inline-flex w-full px-4 py-2 hover:bg-neutral-200'}`}
                    onClick={() => handleFilterSearch('Category')}>
                    Category
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className={`${filter === 'Sub Category' ? 'inline-flex w-full px-4 py-2 hover:bg-neutral-200 bg-neutral-200' : 'inline-flex w-full px-4 py-2 hover:bg-neutral-200'}`}
                    onClick={() => handleFilterSearch('Sub Category')}>
                    Sub Category
                  </button>
                </li>
              </ul>
            </div>
            <div className="relative w-full">
              <form onSubmit={handleSearchData}>
                <input
                  onChange={handleChangeSearch}
                  value={searchQuery}
                  type="search"
                  id="search-dropdown"
                  className="block p-2.5 w-full z-20 text-sm text-textPrimary bg-neutral-50 rounded-e-lg border-s-gray-50 border-s-2 border border-neutral-300 focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder={`Search By ${filter}`}
                  required
                />
                <button
                  type="submit"
                  className="absolute top-0 end-0 p-2.5 text-sm font-medium h-[4.2vh] text-white bg-textSecondary rounded-e-lg border hover:bg-textPrimary focus:ring-4 focus:outline-none focus:ring-cyan-300">
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="relative overflow-x-auto sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right border-neutral-700">
            <thead className="text-xs text-white uppercase bg-textSecondary">
              <tr>
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id="checkbox-table-search-1"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-neutral-100 border-neubg-neutral-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-neubg-neutral-800 dark:focus:ring-offset-neubg-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neubg-neutral-600"
                    />
                    <label
                      htmlFor="checkbox-table-search-1"
                      className="sr-only">
                      checkbox
                    </label>
                  </div>
                </td>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className='flex items-center'>
                    Image
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className='flex items-center w-40'>
                    Product Title
                    <a onClick={() => handleClickSort('title')}>
                      <svg
                        className="w-3 h-3 ms-1.5 cursor-pointer"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </a>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className='flex items-center w-40'>
                    Slug
                    <a onClick={() => handleClickSort('slug')}>
                      <svg
                        className="w-3 h-3 ms-1.5 cursor-pointer"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </a>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className='flex items-center'>
                    Category
                    <a onClick={() => handleClickSort('category')}>
                      <svg
                        className="w-3 h-3 ms-1.5 cursor-pointer"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </a>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className='flex items-center w-28'>
                    Sub Category
                    <a onClick={() => handleClickSort('subCategory')}>
                      <svg
                        className="w-3 h-3 ms-1.5 cursor-pointer"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </a>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className='flex items-center w-28'>
                    Price
                    <a onClick={() => handleClickSort('price')}>
                      <svg
                        className="w-3 h-3 ms-1.5 cursor-pointer"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </a>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className='flex items-center w-28'>
                    Product Realese
                    <a onClick={() => handleClickSort('product_realese')}>
                      <svg
                        className="w-3 h-3 ms-1.5 cursor-pointer"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </a>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className='flex items-center w-28'>
                    Created At
                    <a onClick={() => handleClickSort('createdAt')}>
                      <svg
                        className="w-3 h-3 ms-1.5 cursor-pointer"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </a>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className='text-textSecondary'>
              {products?.data?.map(item => (
                <tr className="bg-white border-b border-neutral-200" key={item._id}>
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-neutral-100 border-neubg-neutral-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-neubg-neutral-800 dark:focus:ring-offset-neubg-neutral-800 focus:ring-2 dark:bg-neutral-700 dark:border-neubg-neutral-600"
                      />
                      <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                    </div>
                  </td>
                  <td className="w-10 p-4">
                    <div className="flex items-center gap-1">
                      <div>
                        <Link to={`/admin/dashboard/products/edit/${item._id}`} title='edit'>
                          <div className='border bg-textSecondary p-1 rounded-md cursor-pointer hover:bg-cyan-500'>
                            <FaRegEdit className='text-xl font-bold text-white' />
                          </div>
                        </Link>
                      </div>
                      <div>
                        <Link to={`/admin/dashboard/products/detail/${item._id}`} className='font-bold' title='add size & preview'>
                          <div className='border bg-textSecondary p-1 rounded-md cursor-pointer hover:bg-green-500'>
                            <IoIosAddCircle className='text-xl font-bold text-white' />
                          </div>
                        </Link>
                      </div>
                      <div>
                        <a onClick={() => handleClickDelete(item._id)} className='cursor-pointer' title='delete'>
                          <div className='border bg-textSecondary p-1 rounded-md cursor-pointer hover:bg-red-500'>
                            <MdDelete className='text-xl font-bold text-white' />
                          </div>
                        </a>
                      </div>
                    </div>
                  </td>
                  <th className="px-6 py-4 font-medium text-textPrimary whitespace-nowrap">
                    <img src={item.url} className='w-56' />
                  </th>
                  <th scope="row" className="px-6 py-4 font-medium text-textPrimary">
                    {(item.title)}
                  </th>
                  <td className="px-6 py-4">
                    {item.slug}
                  </td>
                  <td className="px-6 py-4">
                    {item.category.title}
                  </td>
                  <td className="px-6 py-4">
                    {item.sub_category.title ? item.sub_category.title : '-'}
                  </td>
                  <td className="px-6 py-4">
                    {(item.price).toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      onChange={handleChangeProductRelease(item._id)}
                      value={item.product_status_realese._id}
                      className="bg-neutral-50 border border-neutral-300 text-textPrimary text-sm rounded-lg focus:ring-neutral-500 focus:border-neutral-500 block w-full p-2">
                      {statusRealeses?.data.map(item => (
                        <option key={item._id} value={item._id}>{item.product_status_realese_title}</option>
                      ))}
                    </select>

                  </td>
                  <td className="px-6 py-4">
                    {format(item.created_at, "MMMM d, yyyy HH:mm:ss")}
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
          {/* if products data not found */}
          {products?.data.length <= 0 ?
            (<h1 className='w-full text-center relative text-slate-600 font-normal text-base mt-3 mb-3'>Data Not Found</h1>)
            : null}
          <div className='flex justify-between mt-2'>
            <p className='text-neutral-700 font-medium text-sm'>Total Rows : {products?.totalRows} Page : {products?.totalRows ? products?.page + 1 : 0} of {products?.totalPage}</p>
            <ReactPaginate
              className='flex px-1'
              pageCount={Math.min(20, products?.totalPage)}
              onPageChange={handleChangePage}
              pageLinkClassName="border bg-neutral-100 px-2 rounded-sm hover:bg-neutral-700 hover:text-white"
              previousLinkClassName="font-medium text-neutral-700 hover:text-neutral-800 mr-2"
              nextLinkClassName="font-medium text-neutral-700 hover:text-neutral-800 ml-2"
              activeLinkClassName="text-white bg-neutral-700"
              disabledLinkClassName="hidden"
              forcePage={products?.page}
            />
          </div>
        </div>
      </div>
      <Outlet />
    </>
  )
}

export default Products
