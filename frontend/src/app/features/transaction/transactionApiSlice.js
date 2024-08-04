import { apiSlice } from "../../api/apiSlice";

export const transactionApiSLice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createTrasaction: builder.mutation({
      query: data => ({
        url: '/transaction',
        method: 'POST',
        body: data
      })
    }),
    getOrderSnapBySnapToken: builder.query({
      query: snapToken => ({
        url: `/transaction/snap/${snapToken}`,
        method: 'GET'
      })
    })
  })
})

export const {
  useCreateTrasactionMutation,
  useGetOrderSnapBySnapTokenQuery,
} = transactionApiSLice