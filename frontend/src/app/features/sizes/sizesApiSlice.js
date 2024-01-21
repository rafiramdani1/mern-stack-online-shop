import { apiSlice } from "../../api/apiSlice";

export const sizesSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getSizes: builder.query({
      query: () => '/sizes'
    }),
  })
})

export const {
  useGetSizesQuery,
} = sizesSlice