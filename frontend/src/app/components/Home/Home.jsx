import React, { useEffect } from 'react'
import ProductsLists from './Products.Lists'
import Carousel from '../layouts/Carousel'
import { Link } from 'react-router-dom'
import Footer from '../layouts/Footer'

const Home = () => {
  return (
    <>
      <section>
        <div className='px-20 mt-32'>
          <Carousel />
          <div className=''>
            <div className='mt-10 mb-2'>
              <div className='flex justify-between items-center mb-2 px-36'>
                <div>
                  <h2 className='text-3xl font-bold tracking-tighter text-textPrimary underline decoration-neutral-500 decoration-2 underline-offset-4'>Nike</h2>
                </div>
                <div>
                  <Link to={'/#'} className='text-textPrimary font-medium text-base hover:underline hover:decoration-neutral-500 cursor-pointer hover:decoration-2 hover:underline-offset-4 hover:text-textPrimary'>View all</Link>
                </div>
              </div>
              <ProductsLists category='nike' limitParams={8} />
            </div>
            <div className='mt-10 mb-2'>
              <div className='flex justify-between items-center mb-2 px-36'>
                <div>
                  <h2 className='text-3xl font-bold tracking-tighter text-textPrimary underline decoration-neutral-500 decoration-2 underline-offset-4'>Adidas</h2>
                </div>
                <div>
                  <Link to={'/#'} className='text-textPrimary font-medium text-base hover:underline hover:decoration-neutral-500 cursor-pointer hover:decoration-2 hover:underline-offset-4 hover:text-textPrimary'>View all</Link>
                </div>
              </div>
              <ProductsLists category='adidas' limitParams={8} />
            </div>
            <div className='mt-10 mb-2 bg-white'>
              <div className='flex gap-2 w-full justify-center'>
                <div className=''>
                  <Link to={'/#man'} title="man's">
                    <img className='object-cover h-[70.8vh] rounded-sm transition-all duration-200 filter grayscale hover:grayscale-0' src='/img/category/man.jpg' />
                  </Link>
                </div>
                <div className=''>
                  <Link to={'/#women'} title="women's">
                    <img className='mb-2 object-cover h-[35vh] rounded-sm transition-all duration-200 filter grayscale hover:grayscale-0' src='/img/category/women1.jpg' />
                  </Link>
                  <Link to={'/#kids'} title="kids">
                    <img className='object-cover h-[35vh] w-[100%] rounded-sm transition-all duration-200 filter grayscale hover:grayscale-0' src='/img/category/kids.jpg' />
                  </Link>
                </div>
              </div>
            </div>
            <div className='mt-10 mb-2'>
              <div className='flex justify-between items-center mb-2 px-36'>
                <div>
                  <h2 className='text-3xl font-bold tracking-tighter text-textPrimary underline decoration-neutral-500 decoration-2 underline-offset-4'>New Balance</h2>
                </div>
                <div>
                  <Link to={'/#'} className='text-textPrimary font-medium text-base hover:underline hover:decoration-neutral-500 cursor-pointer hover:decoration-2 hover:underline-offset-4 hover:text-textPrimary'>View all</Link>
                </div>
              </div>
              <ProductsLists category='new balance' limitParams={8} />
            </div>
            <div className='mt-10 mb-2'>
              <div className='flex justify-between items-center mb-2 px-36'>
                <div>
                  <h2 className='text-3xl font-bold tracking-tighter text-textPrimary underline decoration-neutral-500 decoration-2 underline-offset-4'>Vans</h2>
                </div>
                <div>
                  <Link to={'/#'} className='text-textPrimary font-medium text-base hover:underline hover:decoration-neutral-500 cursor-pointer hover:decoration-2 hover:underline-offset-4 hover:text-textPrimary'>View all</Link>
                </div>
              </div>
              <ProductsLists category='vans' limitParams={8} />
            </div>
            <div className='mt-10 mb-2'>
              <div className='flex justify-between items-center mb-2 px-36'>
                <div>
                  <h2 className='text-3xl font-bold tracking-tighter text-textPrimary underline decoration-neutral-500 decoration-2 underline-offset-4'>Others</h2>
                </div>
                <div>
                  <Link to={'/#'} className='text-textPrimary font-medium text-base hover:underline hover:decoration-neutral-500 cursor-pointer hover:decoration-2 hover:underline-offset-4 hover:text-textPrimary'>View all</Link>
                </div>
              </div>
              <ProductsLists category='others' limitParams={8} />
            </div>
          </div>
        </div>
        <div className='bottom-0 w-full h-36 bg-bgPrimaryDark mt-24'>
          <Footer />
        </div>
      </section>
    </>
  )
}

export default Home
