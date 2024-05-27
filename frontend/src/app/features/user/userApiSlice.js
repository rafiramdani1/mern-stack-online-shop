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
    })
  })
})

export const {
  useGetProfileQuery,
  useUpdateUserDetailsMutation
} = userApiSlice