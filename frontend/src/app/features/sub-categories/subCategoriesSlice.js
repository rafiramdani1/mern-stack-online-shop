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
  name: 'sub-categories',
  initialState: {},
  reducers: {}
})