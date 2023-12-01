import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../../api/apiSlice";

export const searchProductQuery = (searchQuery) => async (dispatch, getState) => {
  try {
    const response = await dispatch(apiSlice.endpoints.searchProduct.initiate(searchQuery))
    return response
  } catch (error) {
    console.log(response)
  }
}

const productsSlice = createSlice({
  name: 'products',
  initialState: {},
  reducers: {}
})