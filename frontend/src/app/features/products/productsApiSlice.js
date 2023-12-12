import { apiSlice } from "../../api/apiSlice";

export const productsSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProducts: builder.query({
      query: () => '/products'
    }),
    getProductById: builder.query({
      query: idProduct => ({
        url: `/products/${idProduct}`,
        method: 'GET'
      })
    }),
    getProductBySlug: builder.query({
      query: slugProduct => ({
        url: `/products/slug/${slugProduct}`,
        method: 'GET'
      })
    }),
    getProductsByCategory: builder.query({
      query: category => ({
        url: `products/category/${category}`,
        method: 'GET'
      })
    }),
    addProduct: builder.mutation({
      query: newProduct => ({
        url: 'products',
        method: 'POST',
        body: newProduct,
      })
    }),
    deleteProduct: builder.mutation({
      query: idProduct => ({
        url: `/products/${idProduct}`,
        method: 'DELETE'
      })
    }),
    updateProduct: builder.mutation({
      query: (productData) => ({
        url: `products/${productData.get('idProduct')}`,
        method: 'PUT',
        body: productData
      })
    }),

    // sizes
    addSizeProduct: builder.mutation({
      query: (sizesProduct) => ({
        url: 'products/sizes',
        method: 'POST',
        body: sizesProduct
      })
    }),
    updateSizeProduct: builder.mutation({
      query: (sizeData) => ({
        url: 'products/size/edit',
        method: 'PUT',
        body: sizeData
      })
    }),
    searchProduct: builder.query({
      query: searchQuery => ({
        url: `/products/products/search?q=${searchQuery}`,
        method: 'GET'
      })
    })
  })
})

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductBySlugQuery,
  useGetProductsByCategoryQuery,
  useSearchProductQuery,
  useAddProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useAddSizeProductMutation,
  useUpdateSizeProductMutation,
} = productsSlice