import { apiSlice } from "../../api/apiSlice";

export const categoriesSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCategories: builder.query({
      query: data => ({
        url: `/categories?page=${data.page}&limit=${data.limit}&column=${data.column}&sortDirection=${data.sortDirection}&filter_search=${data.filter_search}&search=${data.searchKeyword}`
      })
    }),
    getCategoryById: builder.query({
      query: idCategory => ({
        url: `/categories/${idCategory}`,
        method: 'GET'
      })
    }),
    addCategory: builder.mutation({
      query: (newCategory) => ({
        url: '/categories',
        method: 'POST',
        body: newCategory
      })
    }),
    deleteCategory: builder.mutation({
      query: idCategory => ({
        url: `/categories/${idCategory}`,
        method: 'DELETE',
      })
    }),
    updateCategory: builder.mutation({
      query: categoryData => ({
        url: `/categories/${categoryData.idCategory}`,
        method: 'PUT',
        body: categoryData
      })
    })
  })
})

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} = categoriesSlice