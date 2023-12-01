import { apiSlice } from "../../api/apiSlice";

export const sizesSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getSizes: builder.query({
      query: () => '/sizes'
    }),
    getSizeById: builder.query({
      query: (idSize) => ({
        url: `/products/size/${idSize}`,
        method: 'GET'
      })
    }),
    deleteSizeProductById: builder.mutation({
      query: idSize => ({
        url: `products/delete/size/${idSize}`,
        method: 'DELETE'
      })
    })
  })
})

export const {
  useGetSizesQuery,
  useGetSizeByIdQuery,
  useDeleteSizeProductByIdMutation,
} = sizesSlice