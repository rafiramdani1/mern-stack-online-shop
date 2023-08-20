import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'

export const CartsContext = createContext()

export const CartsProvider = ({ children }) => {

  const [carts, setCarts] = useState([])
  const [msgSuccess, setMsgSuccess] = useState('')
  const [msgErrors, setMsgErrors] = useState('')

  // GET Carts By User
  const getCartsByUser = async () => {
    try {
      const response = await axios.get('http://localhost:3001/products/api/carts')
      setCarts(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const addCarts = async (data) => {
    try {
      const response = await axios.post('http://localhost:3001/products/add-cart', data)
      getCartsByUser()
      setMsgSuccess(response.data.msg)
    } catch (error) {
      if (error.response) {
        console.log(error.response)
      }
      throw error
    }
  }



  return (
    <CartsContext.Provider value={{ getCartsByUser, carts, addCarts, msgSuccess }}>
      {children}
    </CartsContext.Provider>
  )

}