import { apiSlice } from "../../api/apiSlice";

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCarts: builder.query({
      query: () => 'carts'
    }),
    addCart: builder.mutation({
      query: (cartData) => ({
        url: 'carts',
        method: 'POST',
        body: cartData
      })
    }),
    deleteCart: builder.mutation({
      query: idCart => ({
        url: `products/cart/delete/${idCart}`,
        method: 'DELETE'
      })
    })
  })
})

export const {
  useGetCartsQuery,
  useAddCartMutation,
  useDeleteCartMutation,
} = cartApiSlice