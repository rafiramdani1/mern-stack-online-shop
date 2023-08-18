import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'

export const SubCategoriesContext = createContext()

export const SubCategoriesProvider = ({ children }) => {
  const [subCategories, setSubCategories] = useState([])
  const [msgError, setMsgError] = useState('')
  const [msgSuccess, setMsgSuccess] = useState('')

  const getSubCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3001/sub-categories')
      setSubCategories(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getSubCategoryById = async id => {
    try {
      const response = await axios.get(`http://localhost:3001/sub-categories/${id}`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }

  const getSubCategoryByCategoryId = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/sub-categories/sub-category-id/${id}`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }

  const clearError = () => setMsgError(null)

  const addSubCategory = async (data) => {
    try {
      const response = await axios.post('http://localhost:3001/sub-categories/addSubCategory', data)
      setMsgSuccess(response.data.msg)
      getSubCategories()
    } catch (error) {
      if (error.response) {
        setMsgError(error.response.data.msg)
      }
      throw error
    }
  }

  const editSubCategory = async (id, data) => {
    try {
      const response = await axios.put(`http://localhost:3001/sub-categories/editSubCategory/${id}`, data)
      setMsgSuccess(response.data.msg)
      getSubCategories()
    } catch (error) {
      if (error.response) {
        setMsgError(error.response.data.msg)
      }
      throw error
    }
  }

  const deleteSubCategory = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3001/sub-categories/delete/${id}`)
      setMsgSuccess(response.data.msg)
      getSubCategories()
    } catch (error) {
      console.log(error.response.statusText)
      throw error
    }
  }

  return (
    <SubCategoriesContext.Provider value={{ getSubCategories, getSubCategoryById, getSubCategoryByCategoryId, subCategories, addSubCategory, editSubCategory, deleteSubCategory, msgError, msgSuccess, clearError }}>
      {children}
    </SubCategoriesContext.Provider>
  )
}