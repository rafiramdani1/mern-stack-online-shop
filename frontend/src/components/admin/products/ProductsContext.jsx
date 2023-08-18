import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'

export const ProductsContext = createContext()

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [sizes, setSizes] = useState([])
  const [msgSuccess, setMsgSuccess] = useState('')
  const [msgErrors, setMsgErrors] = useState('')

  const getProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/products')
      setProducts(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getProductById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/products/${id}`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }

  const getProductBySlug = async (slug) => {
    try {
      const response = await axios.get(`http://localhost:3001/products/products/${slug}`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }

  const getSizes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/products/productSize/sizes')
      setSizes(response.data.size)
    } catch (error) {
      console.log(error)
    }
  }

  const getSizeProductById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/products/size/${id}`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }

  const clearError = () => setMsgErrors(null)

  const addProduct = async (data) => {
    try {
      const response = await axios.post('http://localhost:3001/products/add-product', data, { headers: { "Content-Type": "multipart/form-data" } })
      setMsgSuccess(response.data.msg)
      getProducts()
    } catch (error) {
      if (error.response) {
        setMsgErrors(error.response.data.msg)
      }
      throw error
    }
  }

  const editProduct = async (id, data) => {
    try {
      const response = await axios.put(`http://localhost:3001/products/edit/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } })
      setMsgSuccess(response.data.msg)
      getProducts()
    } catch (error) {
      if (error.response) {
        setMsgErrors(error.response.data.msg)
      }
      throw error
    }
  }

  return (
    <ProductsContext.Provider value={{ getProducts, products, getProductById, getSizes, getProductBySlug, getSizeProductById, sizes, addProduct, editProduct, msgSuccess, msgErrors, clearError }}>
      {children}
    </ProductsContext.Provider>
  )
}
