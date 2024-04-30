import { createSlice } from "@reduxjs/toolkit";

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    success: false,
    msg: '',
    page: 0,
    limit: 10,
    column: '',
    sortDirection: false,
    filter_search: 'all',
    searchKeyword: ''
  },
  reducers: {
    setSuccess: (state, action) => {
      state.success = action.payload?.success
      state.msg = action.payload?.msg
    },
    resetSuccess: (state, action) => {
      state.success = false
      state.msg = ''
    },
    setPaginationCategories: (state, action) => {
      if (action.payload.page || action.payload.page === 0) {
        state.page = action.payload.page
      } else if (action.payload.sortCol) {
        state.column = action.payload.sortCol
        state.sortDirection = !state.sortDirection
      } else if (action.payload.filter) {
        state.filter_search = action.payload.filter
      } else if (action.payload.search) {
        state.page = 0
        state.searchKeyword = action.payload
      }
    },
    resetPaginationCategories: (state, action) => {
      state.page = 0
      state.limit = 10
      state.column = ''
      state.sortDirection = false
      state.filter_search = 'all'
      state.searchKeyword = ''
    }
  }
})

export const { resetPaginationCategories, setPaginationCategories, setSuccess, resetSuccess } = categoriesSlice.actions
export default categoriesSlice.reducer
export const selectCurrentSuccess = state => state.categories.success
export const selectCurrentMsg = state => state.categories.msg
export const selectCurrentPageCategories = state => state.categories.page
export const selectCurrentLimitCategories = state => state.categories.limit
export const selectCurrentColumnCategories = state => state.categories.column
export const selectCurrentSortDirectionCategories = state => state.categories.sortDirection
export const selectCurrentFilterSearchCategories = state => state.categories.filter_search
export const selectCurrentSearchKeywordCategories = state => state.categories.searchKeyword