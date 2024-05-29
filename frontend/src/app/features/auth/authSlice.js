import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../../api/apiSlice";
import jwtDecode from "jwt-decode";

export const refreshToken = () => async (dispatch, getState) => {
  try {
    const response = await dispatch(apiSlice.endpoints.getRefreshToken.initiate())

    // exp token in cookies
    if (response.error?.originalStatus === 403) {
      await dispatch(apiSlice.endpoints.logout.initiate())
    }

    if (response.isSuccess) {
      await dispatch(setCredentials(response.data))
    }
  } catch (error) {
    console.log(error)
  }
}

const isAuthLocalStorage = localStorage.getItem('isAuth')

const authSlice = createSlice({
  name: 'auth',
  initialState: {
      user: null,
    token: null,
    isAuth: isAuthLocalStorage ? isAuthLocalStorage : null
  },
  reducers: {
    setCredentials: (state, action) => {
      localStorage.setItem('isAuth', true)
      state.isAuth = 'true'
      state.token = action.payload.accessToken
      state.user = jwtDecode(action.payload.accessToken)
    },
    setLogOut: (state, action) => {
      state.isAuth = null
      localStorage.removeItem('isAuth')
      state.token = null
      state.user = null
    }
  }
})

export const { setCredentials, setLogOut } = authSlice.actions
export default authSlice.reducer
export const selectCurrentUser = state => state.auth.user
export const selectCurrentToken = state => state.auth.token
export const selectCurrentIsAuth = state => state.auth.isAuth