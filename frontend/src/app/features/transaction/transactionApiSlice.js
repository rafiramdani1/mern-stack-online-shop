import { apiSlice } from "../../api/apiSlice";

export const transactionApiSLice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createTrasaction: builder.mutation({
      query: data => ({
        url: '/transaction',
        method: 'POST',
        body: data
      })
    })
  })
})

export const { useCreateTrasactionMutation } = transactionApiSLice