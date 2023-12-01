import { apiSlice } from "../../api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: { ...credentials }
      })
    }),
    getRefreshToken: builder.query({
      query: () => '/auth/token'
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'DELETE'
      })
    }),
    register: builder.mutation({
      query: userData => ({
        url: '/auth/register',
        method: 'POST',
        body: userData
      })
    }),
    verifyEmailAccount: builder.query({
      query: credentials => ({
        url: `/auth/user/verify/${credentials.id}/${credentials.token}`,
        method: 'GET'
      })
    })
  })
})

export const {
  useLoginMutation,
  useGetRefreshTokenQuery,
  useLogoutMutation,
  useRegisterMutation,
  useVerifyEmailAccountQuery,
} = authApiSlice