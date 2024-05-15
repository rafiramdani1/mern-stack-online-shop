import { apiSlice } from "../../api/apiSlice";

export const productsSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProducts: builder.query({
      query: data => ({
        url: `products?page=${data.page}&limit=${data.limit}&column=${data.column}&sortDirection=${data.sortDirection}&filter_search=${data.filter_search}&search=${data.searchKeyword}&product_realese=${data.product_realese}&minPrice=${data.minPriceGlobal}&maxPrice=${data.maxPriceGlobal}&sizes=${data?.sizes?.join(',')}`
      })
    }),
    getProductById: builder.query({
      query: idProduct => ({
        url: `/products/id/${idProduct}`,
        method: 'GET'
      })
    }),
    getProductBySlug: builder.query({
      query: slugProduct => ({
        url: `/products/slug/${slugProduct}`,
        method: 'GET'
      })
    }),
    getProductByCategoryId: builder.query({
      query: categoryId => ({
        url: `products/category/${categoryId}`,
        method: 'GET'
      })
    }),
    getProductByCategorySlug: builder.query({
      query: data => ({
        url: `products/productsByCategorySlug?page=${data.page}&limit=${data.limit}&column=${data.column}&sortDirection=${data.sortDirection}&search=${data.searchKeyword}&product_realese=${data.product_realese}&slug=${data.slug}&minPrice=${data.minPriceGlobal}&maxPrice=${data.maxPriceGlobal}&sizes=${data?.sizes?.join(',')}`,
        method: 'GET'
      })
    }),
    getProductBySubCategorySlug: builder.query({
      query: data => ({
        url: `products/productsBySubCategorySlug?page=${data.page}&limit=${data.limit}&column=${data.column}&sortDirection=${data.sortDirection}&search=${data.searchKeyword}&product_realese=${data.product_realese}&slug=${data.slug}&minPrice=${data.minPriceGlobal}&maxPrice=${data.maxPriceGlobal}&sizes=${data?.sizes?.join(',')}`,
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
    getSizeProductById: builder.query({
      query: (idSize) => ({
        url: `products/sizes/${idSize}`,
        method: 'GET'
      })
    }),
    addSizeProduct: builder.mutation({
      query: (sizesProduct) => ({
        url: 'products/sizes',
        method: 'POST',
        body: sizesProduct
      })
    }),
    updateSizeProduct: builder.mutation({
      query: (sizeData) => ({
        url: 'products/sizes/edit',
        method: 'PUT',
        body: sizeData
      })
    }),
    deleteSizeProductById: builder.mutation({
      query: idSize => ({
        url: `products/delete/sizes/${idSize}`,
        method: 'DELETE'
      })
    }),
    searchProduct: builder.query({
      query: searchQuery => ({
        url: `/products/products/search?q=${searchQuery}`,
        method: 'GET'
      })
    }),

    // realses status
    getRealeseStatus: builder.query({
      query: () => ({
        url: '/products/status-realese',
        method: 'GET'
      })
    }),
    updateProductRealese: builder.mutation({
      query: data => ({
        url: 'products/edit/status-realese',
        method: 'PUT',
        body: data
      })
    })
  })
})

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductBySlugQuery,
  useGetProductsByCategoryQuery,
  useGetProductByCategoryIdQuery,
  useGetProductByCategorySlugQuery,
  useGetProductBySubCategorySlugQuery,
  useSearchProductQuery,
  useAddProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useGetSizeProductByIdQuery,
  useAddSizeProductMutation,
  useUpdateSizeProductMutation,
  useDeleteSizeProductByIdMutation,
  useGetRealeseStatusQuery,
  useUpdateProductRealeseMutation,
} = productsSlice