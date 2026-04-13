/* eslint-disable no-unused-vars */
import React from 'react';
import heroImg from '../../assets/hero.png';
import heroIcon from '../../assets/heroIcon.svg';
import heroIcon2 from '../../assets/heroIcon2.svg';
import heroIcon3 from '../../assets/heroIcon3.png';

const Hero = () => {
  return (
    <>
      <div className='container lg:w-9/10 rounded-4xl mt-26 bg-[#E8ECE9]
 mx-auto px-8 pr-0 py-10'>
        <div className='flex flex-col md:flex-row items-center justify-between'>
          <div className='text-center md:text-left md:w-1/2'>
            <div className='flex items-center justify-between'>
              <h2 className='text-[45px] font-bold'>
                Welcome to
              </h2>
              <img src='/frameLogo.png' className='w-[275px] h-[86px]' />
            </div>
            <h2 className='text-[45px] font-bold mt-1 mb-8'>
              Where Learning <br /> Comes Alive!
            </h2>
            <div className='mt-6'>
              <button className='bg-[#09B451] text-[#001B07] px-6 py-3 rounded hover:bg-green-700 transition duration-300'>
                Apply Now
              </button>
            </div>
          </div>

          <div className='mt-5 md:mt-0 md:w-1/2 flex justify-center'>
            <img src='homeHeroImg.png' alt='Hero' className='' />
          </div>
        </div>
      </div>


      <div className='w-4/5 mx-auto'>
        <div className='mt-[-10px] grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white shadow-lg p-6 rounded-lg text-center'>
            <img src={heroIcon} alt='icon' className='w-12 mx-auto bg-green-600' />
            <h3 className='text-xl font-semibold mt-4'>Expert Instructors</h3>
            <p className='text-gray-600 mt-2'>The gradual accumulation of information about atomic and small-scale behaviour...</p>
          </div>
          <div className='bg-white shadow-lg p-6 rounded-lg text-center'>
            <img src={heroIcon2} alt='icon' className='w-12 mx-auto bg-green-600' />
            <h3 className='text-xl font-semibold mt-4'>Training Courses</h3>
            <p className='text-gray-600 mt-2'>The gradual accumulation of information about atomic and small-scale behaviour...</p>
          </div>
          <div className='bg-white shadow-lg p-6 rounded-lg text-center'>
            <img src={heroIcon3} alt='icon' className='w-12 mx-auto bg-green-600' />
            <h3 className='text-xl font-semibold mt-4'>Expert Instructors</h3>
            <p className='text-gray-600 mt-2'>The gradual accumulation of information about atomic and small-scale behaviour...</p>
          </div>
        </div>
      </div>
    </>

  );
};

export default Hero;
