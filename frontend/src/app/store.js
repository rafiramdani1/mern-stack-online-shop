import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import { apiSlice } from './api/apiSlice'
import cartReducer from './features/cart/cartSlice'
import paginationReducer from './features/pagintation/paginationSlice'
import subCategoriesReducer from './features/sub-categories/subCategoriesSlice'
import productsReducer from './features/products/productsSlice'
import categoriesReducer from './features/categories/categoriesSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    cart: cartReducer,
    pagination: paginationReducer,
    products: productsReducer,
    categories: categoriesReducer,
    subCategories: subCategoriesReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true
})