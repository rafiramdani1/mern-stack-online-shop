import { apiSlice } from "../../api/apiSlice";

export const subCategoriesSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getSubCategories: builder.query({
      query: () => '/sub-categories'
    }),
    getSubCategoryById: builder.query({
      query: idSubCategory => ({
        url: `/sub-categories/${idSubCategory}`,
        method: 'GET'
      })
    }),
    getSubCategoryByCategoryId: builder.query({
      query: idCategory => ({
        url: `/sub-categories/category/${idCategory}`,
        method: 'GET'
      })
    }),
    addSubCategory: builder.mutation({
      query: (newSubCategory) => ({
        url: '/sub-categories',
        method: 'POST',
        body: newSubCategory
      })
    }),
    deleteSubCategory: builder.mutation({
      query: idSubCategory => ({
        url: `/sub-categories/${idSubCategory}`,
        method: 'DELETE',
      })
    }),
    updateSubCategory: builder.mutation({
      query: subCategoryData => ({
        url: `/sub-categories/${subCategoryData.idSubCategory}`,
        method: 'PUT',
        body: subCategoryData
      })
    })
  })
})

export const {
  useGetSubCategoriesQuery,
  useGetSubCategoryByIdQuery,
  useGetSubCategoryByCategoryIdQuery,
  useAddSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useUpdateSubCategoryMutation,
} = subCategoriesSlice