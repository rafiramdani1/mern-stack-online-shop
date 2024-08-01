import { apiSlice } from "../../api/apiSlice";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getOrderByUserId: builder.query({
      query: userId => ({
        url: `/order/${userId}`
      })
    }),
    getOrderByTransactionId: builder.query({
      query: transactionId => ({
        url: `/order?transaction_id=${transactionId}`
      })
    })
  })
})

export const {
  useGetOrderByUserIdQuery,
  useGetOrderByTransactionIdQuery,
} = orderApiSlice