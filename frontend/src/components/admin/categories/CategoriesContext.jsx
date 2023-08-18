import axios from 'axios'
import React, { createContext, useState } from 'react'

export const CategoriesContext = createContext()

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([])
  const [msgErrors, setMsgErrors] = useState('')
  const [msgSuccess, setMsgSuccess] = useState('')

  const getCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3001/categories')
      setCategories(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getCategoryById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3001/categories/${id}`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }

  const clearError = () => {
    setMsgErrors(null)
  }

  const addCategories = async (categoriesData) => {
    try {
      const response = await axios.post('http://localhost:3001/categories/add-categories', categoriesData)
      setMsgSuccess(response.data.msg)
      getCategories()
    } catch (error) {
      if (error.response) {
        setMsgErrors(error.response.data.msg)
      }
      throw error
    }
  }

  const editCategory = async (id, categoriesData) => {
    try {
      const response = await axios.put(`http://localhost:3001/categories/edit-categories/${id}`, categoriesData)
      setMsgSuccess(response.data.msg)
      getCategories()
    } catch (error) {
      if (error.response) {
        setMsgErrors(error.response.data.msg)
      }
      throw error
    }
  }

  const deleteCategory = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3001/categories/delete/${id}`)
      setMsgSuccess(response.data.msg)
      getCategories()
    } catch (error) {
      console.log(error.response.statusText)
      throw error
    }
  }

  return (
    <CategoriesContext.Provider value={{ getCategories, getCategoryById, categories, addCategories, editCategory, deleteCategory, msgErrors, clearError, msgSuccess }}>
      {children}
    </CategoriesContext.Provider>
  )
}
