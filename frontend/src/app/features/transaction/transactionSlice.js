import { apiSlice } from "../../api/apiSlice"

export const getSnapBySnapToken = (snapToken) => async (dispatch, getState) => {
  try {
    const response = await dispatch(apiSlice.endpoints.getOrderSnapBySnapToken.initiate(snapToken))
    return response
  } catch (error) {
    console.log(error)
  }
}