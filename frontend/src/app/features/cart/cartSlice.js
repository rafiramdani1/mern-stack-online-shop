import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    quantity: 1,
    price: 0,
    subTotal: 0
  },
  reducers: {
    setIncrementQty: (state, action) => {
      state.quantity++
      const countTotal = state.price * state.quantity
      state.subTotal = countTotal.toLocaleString("id-ID")
    },
    setDecrementQty: (state, action) => {
      state.quantity--
      const countTotal = parseInt(state.subTotal.replace(/\./g, "")) - state.price
      state.subTotal = countTotal.toLocaleString("id-ID")
    },
    setPrice: (state, action) => {
      state.quantity = 1
      state.price = action.payload
      state.subTotal = action.payload
    },
    resetState: (state, action) => {
      state.quantity = 1
      state.price = 0
      state.subTotal = 0
    }
  }
})

export const { setIncrementQty, setDecrementQty, setPrice, resetState } = cartSlice.actions
export default cartSlice.reducer
export const selectQuantityCart = state => state.cart.quantity
export const selectPriceProduct = state => state.cart.price
export const selectsubTotalCart = state => state.cart.subTotal