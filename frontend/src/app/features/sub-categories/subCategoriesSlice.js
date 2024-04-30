import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../../api/apiSlice";

export const fetchSubCategoriesByCategoryId = (id) => async (dispatch, getState) => {
  try {
    const response = await dispatch(apiSlice.endpoints.getSubCategoryByCategoryId.initiate(id))
    return response.data
  } catch (error) {
    console.log(error)
  }
}

const subCategoriesSlice = createSlice({
  name: 'subCategories',
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
    setPaginationSubCategories: (state, action) => {
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
    resetPaginationSubCategories: (state, action) => {
      state.page = 0
      state.limit = 10
      state.column = ''
      state.sortDirection = false
      state.filter_search = 'all'
      state.searchKeyword = ''
    }
  }
})

export const { setSuccess, resetSuccess, resetPaginationSubCategories, setPaginationSubCategories } = subCategoriesSlice.actions
export default subCategoriesSlice.reducer
export const selectCurrentSuccess = state => state.subCategories.success
export const selectCurrentMsg = state => state.subCategories.msg
export const selectCurrentPageSubCategories = state => state.subCategories.page
export const selectCurrentLimitSubCategories = state => state.subCategories.limit
export const selectCurrentColumnSubCategories = state => state.subCategories.column
export const selectCurrentSortDirectionSubCategories = state => state.subCategories.sortDirection
export const selectCurrentFilterSearchSubCategories = state => state.subCategories.filter_search
export const selectCurrentSearchKeywordSubCategories = state => state.subCategories.searchKeyword