import React, { useEffect } from 'react'
import ProductsLists from './Products.Lists'
import Carousel from '../layouts/Carousel'

const Home = () => {

  return (
    <>
      <section>
        <Carousel />
        <ProductsLists />
      </section>
    </>
  )
}

export default Home
