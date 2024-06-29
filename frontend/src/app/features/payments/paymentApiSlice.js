import { apiSlice } from "../../api/apiSlice";

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getPaymentToken: builder.mutation({
      query: data => ({
        url: '/payment/token',
        method: 'POST',
        body: data
      })
    })
  })
})

export const { useGetPaymentTokenMutation } = paymentApiSlice