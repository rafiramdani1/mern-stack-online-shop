import { apiSlice } from "../../api/apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProfile: builder.query({
      query: () => ({
        url: `/user/profile`
      })
    }),
    updateUserDetails: builder.mutation({
      query: userData => ({
        url: `/user`,
        method: 'POST',
        body: userData
      })
    }),
    getShippingAddressByUser: builder.query({
      query: () => ({
        url: '/user/shipping-address'
      })
    }),
    addShippingAddress: builder.mutation({
      query: data => ({
        url: '/user/add-shipping',
        method: 'POST',
        body: data
      })
    }),
    updateStatusShipping: builder.mutation({
      query: data => ({
        url: '/user/update-status-shipping',
        method: 'PUT',
        body: data
      })
    })
  })
})

export const {
  useGetProfileQuery,
  useUpdateUserDetailsMutation,
  useGetShippingAddressByUserQuery,
  useAddShippingAddressMutation,
  useUpdateStatusShippingMutation,
} = userApiSlice