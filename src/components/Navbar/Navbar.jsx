/* eslint-disable no-unused-vars */
import './Navbar.css'
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaReact, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { BiSearch } from 'react-icons/bi';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className='bg-[#FFFFFF] shadow fixed w-full top-0 left-0 z-50'>
            <div className='mx-auto flex justify-between items-center lg:px-16 md:px-10 py-4'>
                {/* Logo */}
                <div className='flex items-center text-xl font-bold gap-[11px]'>
                    <img src='/logo.png' className='w-[44px] h-[44px]' />
                    <img src='/frameLogo.png' className='w-[117px] h-[36px]' />
                    {/* <span className='text-purple-600 text-lg'>WiSchool</span> */}
                </div>

                {/* Desktop Menu */}
                <div className='hidden text-[#989E99] text[16px] md:flex items-center gap-6'>
                    <Link to='/' className='hover:text-[#09B451]'>Home</Link>
                    <Link to='/academics' className='hover:text-[#09B451]'>Academics</Link>
                    <Link to='/about' className='hover:text-[#09B451]'>About us</Link>
                    <Link to='/admission' className='hover:text-[#09B451]'>Admission</Link>
                    {/* <Link to='/payment' className='hover:text-[#09B451]'>Online Payment</Link> */}
                    <Link to='/gallery' className='hover:text-[#09B451]'>Gallery</Link>
                    <Link to='/news-event' className='hover:text-[#09B451]'>News/Event</Link>
                    <Link to='/blog' className='hover:text-[#09B451]'>Blog</Link>
                    <Link to='/contact' className='hover:text-[#09B451]'>Contact us</Link>
                </div>

                {/* Right Section (Search & Login) */}
                <div className='hidden md:flex items-center gap-[20px]'>
                    <BiSearch className='w-5 h-5 text-[#B40916] cursor-pointer' />
                    <Link to='/student-login'>
                        <button className='bg-[#09B451] text-[#001B07] text-[16px] px-[28px] py-[10px] rounded hover:bg-green-700 transition duration-300'>
                            Login
                        </button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle Button */}
                <div className='md:hidden'>
                    <button onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <FaTimes className='w-6 h-6 text-purple-600' /> : <FaBars className='w-6 h-6 text-purple-600' />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className='md:hidden absolute top-16 left-0 w-full bg-white shadow-lg flex flex-col items-center py-4 space-y-4'>
                    <Link to='/' className='hover:text-green-600' onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link to='/academics' className='hover:text-green-600' onClick={() => setMenuOpen(false)}>Academics</Link>
                    <Link to='/about' className='hover:text-green-600' onClick={() => setMenuOpen(false)}>About us</Link>
                    <Link to='/admission' className='hover:text-green-600' onClick={() => setMenuOpen(false)}>Admission</Link>
                    <Link to='/payment' className='hover:text-green-600' onClick={() => setMenuOpen(false)}>Online Payment</Link>
                    <Link to='/gallery' className='hover:text-green-600' onClick={() => setMenuOpen(false)}>Gallery</Link>
                    <Link to='/news-event' className='hover:text-green-600' onClick={() => setMenuOpen(false)}>News/Event</Link>
                    <Link to='/blog' className='hover:text-green-600' onClick={() => setMenuOpen(false)}>Blog</Link>
                    <Link to='/contact' className='hover:text-green-600' onClick={() => setMenuOpen(false)}>Contact us</Link>

                    <div className='flex items-center gap-3'>
                        <FaSearch className='w-5 h-5 text-purple-500 cursor-pointer' />
                        <Link to='/student-login'>
                            <button className='bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300'>
                                Login
                            </button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
