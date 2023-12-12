import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../../api/apiSlice";

export const getSizeById = (id) => async (dispatch, getState) => {
  try {
    const response = await dispatch(apiSlice.endpoints.getSizeById.initiate(id))
    return response.data
  } catch (error) {
    console.log(error)
  }
}

const sizesSlice = createSlice({
  name: 'sub-categories',
  initialState: {},
  reducers: {}
})