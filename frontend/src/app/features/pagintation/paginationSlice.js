import { createSlice } from "@reduxjs/toolkit";

const paginationSlice = createSlice({
  name: 'pagination',
  initialState: {
    page: 0,
    limit: 10,
    column: '',
    sortDirection: false,
    filter_search: 'all',
    searchKeyword: ''
  },
  reducers: {
    setPagination: (state, action) => {
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
    resetPagination: (state, action) => {
      state.page = 0
      state.limit = 3
      state.column = ''
      state.sortDirection = false
      state.filter_search = 'all'
      state.searchKeyword = ''
    }
  }
})

export const { resetPagination, setPagination } = paginationSlice.actions
export default paginationSlice.reducer
export const selectCurrentPage = state => state.pagination.page
export const selectCurrentLimit = state => state.pagination.limit
export const selectCurrentColumn = state => state.pagination.column
export const selectCurrentSortDirection = state => state.pagination.sortDirection
export const selectCurrentFilterSearch = state => state.pagination.filter_search
export const selectCurrentSearchKeyword = state => state.pagination.searchKeyword