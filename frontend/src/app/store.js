import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import { apiSlice } from './api/apiSlice'
import cartReducer from './features/cart/cartSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    cart: cartReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true
})