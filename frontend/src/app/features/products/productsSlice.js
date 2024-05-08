import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../../api/apiSlice";

export const getSizeProductById = (id) => async (dispatch, getState) => {
  try {
    const response = await dispatch(apiSlice.endpoints.getSizeProductById.initiate(id))
    return response.data
  } catch (error) {
    console.log(error)
  }
}

export const searchProductQuery = (data) => async (dispatch, getState) => {
  try {
    console.log(data)
    const response = await dispatch(apiSlice.endpoints.getProducts.initiate(data))
    return response
  } catch (error) {
    console.log(response)
  }
}

export const updateProductRealese = (data) => async (dispatch, getState) => {
  try {
    const response = await dispatch(apiSlice.endpoints.updateProductRealese.initiate(data))
    return response
  } catch (error) {
    console.log(error)
  }
}

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    page: 0,
    limit: 10,
    column: '',
    sortDirection: false,
    filter_search: 'all',
    searchKeyword: '',
    product_realese: '',
    sort: 'Sort By Latest',
    maxPrice: '',
    minPrice: '',
    sizes: []
  },
  reducers: {
    setPaginationProduct: (state, action) => {
      if (action.payload.page || action.payload.page === 0) {
        state.page = action.payload.page
      } else if (action.payload.sortCol) {
        if (action.payload.sortCol.column) {
          state.column = action.payload.sortCol.column
          state.sortDirection = action.payload.sortCol.sortDirection
        } else {
          state.column = action.payload.sortCol
          state.sortDirection = !state.sortDirection
        }
      } else if (action.payload.filter) {
        state.filter_search = action.payload.filter
      } else if (action.payload.search) {
        state.page = 0
        state.searchKeyword = action.payload.search
      }
    },
    setSortProduct: (state, action) => {
      state.sort = action.payload
    },
    setFilterProduct: (state, action) => {
      if (action.payload.minPrice) {
        state.minPrice = action.payload.minPrice
      } else if (action.payload.maxPrice) {
        state.maxPrice = action.payload.maxPrice
      } else if (action.payload.size) {
        state.sizes.push(action.payload.size)
      }
    },
    setDeleteSizeProduct: (state, action) => {
      state.sizes = state.sizes.filter(size => size !== action.payload)
    },
    resetSortProduct: (state, action) => {
      state.sort = 'Sort By Latest'
    },
    resetFilterProduct: (state, action) => {
      state.maxPrice = ''
      state.minPrice = ''
      state.sizes = []
    },
    resetSearchKeyword: (state, action) => {
      state.searchKeyword = ''
    },
    resetPaginationProduct: (state, action) => {
      state.page = 0
      state.limit = 10
      state.column = ''
      state.sortDirection = false
      state.filter_search = 'all'
      // state.searchKeyword = ''
      state.product_realese = ''
      // state.sort = 'Sort By Latest'
      // state.maxPrice = ''
      // state.minPrice = ''
      // state.sizes = []
    }
  }
})

export const { resetPaginationProduct, setPaginationProduct, setSortProduct, setFilterProduct, setDeleteSizeProduct, resetSortProduct, resetFilterProduct, resetSearchKeyword } = productsSlice.actions
export default productsSlice.reducer
export const selectCurrentPageProduct = state => state.products.page
export const selectCurrentLimitProduct = state => state.products.limit
export const selectCurrentColumnProduct = state => state.products.column
export const selectCurrentSortDirectionProduct = state => state.products.sortDirection
export const selectCurrentFilterSearchProduct = state => state.products.filter_search
export const selectCurrentSearchKeywordProduct = state => state.products.searchKeyword
export const selectCurrentProductRealese = state => state.products.product_realese
export const selectCurrentSortProduct = state => state.products.sort
export const selectCurrentMaxPriceProduct = state => state.products.maxPrice
export const selectCurrentMinPriceProduct = state => state.products.minPrice
export const selectCurrentSizesProduct = state => state.products.sizes
export const selectCurrentSearchKeyWordProduct = state => state.products.searchKeyword

