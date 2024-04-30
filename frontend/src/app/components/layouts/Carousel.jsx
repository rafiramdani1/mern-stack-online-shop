import React, { useState, useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/pagination';
// import 'swiper/css/navigation';
import { GrPrevious, GrNext } from "react-icons/gr";

// modules = { [Autoplay, Pagination, Navigation]}
const Carousel = () => {
  const [isHovered, setIsHovered] = React.useState(false);
  const swiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  React.useEffect(() => {
    if (swiperRef.current) {
      const swiperInstance = swiperRef.current.swiper;
      if (isHovered) {
        swiperInstance.navigation.update();
        swiperInstance.navigation.init();
      } else {
        swiperInstance.navigation.destroy();
      }
    }
  }, [isHovered]);

  const handlePrevClick = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNextClick = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };
  return (
    <>
      <section className='px-36 mt-52'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        <div

        >
          <Swiper
            ref={swiperRef}
            spaceBetween={15}
            centeredSlides={false}
            loop={true}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
            }}
            navigation={
              {
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }
            }
            pagination={{
              clickable: true,
              renderBullet: function (index, className) {
                return '<span class="' + className + '">' + '' + '</span>';
              },
            }}
            modules={[Autoplay, Pagination, Navigation]}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
            }}
          >
            <SwiperSlide>
              <img className='w-[100%] h-[28vh] rounded-md' src='/img/banner/2.jpg' alt='Banner 2' />
            </SwiperSlide>
            <SwiperSlide>
              <img className='w-[100%] h-[28vh] rounded-md' src='/img/banner/3.jpg' alt='Banner 3' />
            </SwiperSlide>
            <SwiperSlide>
              <img className='w-[100%] h-[28vh] rounded-md' src='/img/banner/1.jpg' alt='Banner 1' />
            </SwiperSlide>
            {/* Custom navigation buttons */}
          </Swiper>
          <div ref={prevRef} className={isHovered ? 'swiper-button-prev absolute top-[34.4%] z-10 left-44' : 'hidden'} onClick={handlePrevClick}>
            <GrPrevious className='text-4xl text-neutral-500 hover:text-textSecondary cursor-pointer' />
          </div>
          <div ref={nextRef} className={isHovered ? 'swiper-button-next absolute top-[34.4%] z-10 right-44' : 'hidden'} onClick={handleNextClick}>
            <GrNext className='text-4xl text-neutral-500 hover:text-textSecondary cursor-pointer' />
          </div>
        </div>
      </section>
    </>
  )
}

export default Carousel
