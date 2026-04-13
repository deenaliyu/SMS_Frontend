/* eslint-disable no-unused-vars */
import React from 'react';
import heroImg from '../../assets/hero.png';
import heroIcon from '../../assets/heroIcon.svg';
import heroIcon2 from '../../assets/heroIcon2.svg';
import heroIcon3 from '../../assets/heroIcon3.png';

const Hero = () => {
  return (
    <div className='container bg-[#E8ECE9]
 mx-auto px-5 py-10'>
      <div className='flex flex-col md:flex-row items-center justify-between'>
        <div className='text-center md:text-left md:w-1/2'>
          <h2 className='text-7xl font-bold'>
            Welcome to <span className='text-purple-600'>WiSchool</span>
          </h2>
          <h2 className='text-6xl font-semibold mt-3'>
            Where Learning <br /> Comes Alive!
          </h2>
          <div className='mt-6'>
            <button className='bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-300'>
              Start Here
            </button>
          </div>
        </div>

        <div className='mt-5 md:mt-0 md:w-1/2 flex justify-center'>
          <img src={heroImg} alt='Hero' className='h-100 rounded-lg w-full max-w-sm md:max-w-md' />
        </div>
      </div>
      <div className='mt-9 grid grid-cols-1 md:grid-cols-3 gap-6'>
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
  );
};

export default Hero;
