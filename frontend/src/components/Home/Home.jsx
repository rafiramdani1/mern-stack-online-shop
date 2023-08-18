import React from 'react'
import Header from '../Layouts/Header'
import Navbar from '../Layouts/Navbar'
import ProductsLists from './Products.Lists'
import Carousel from '../Layouts/Carousel'

const Home = () => {

  return (
    <>
      <Header />
      <section className='px-20 mt-32 mb-96'>
        <Carousel />
        <ProductsLists />
      </section>
    </>
  )
}

export default Home
