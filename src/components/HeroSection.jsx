import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from "prop-types";
// import HeroSection from "../components/HeroSection";

const HeroSection = ({ title, text, image, btn, about }) => {
    return (
        <div className="relative h-[80vh] sm:pb-15 mt-15 bg-[#001B07] items-center text-[#F5F5F5] flex text-right  justify-center">
            <img
                src={image}
                alt="Contact Us"
                className="absolute inset-0 w-full absolute h-full object-cover opacity-50"
            />
            <div className="relative text-justify p-18">
                <h1 className="text-[50px] font-bold">{title}</h1>
                <p className="mt-2 text-[24px]">{text}</p>
                {btn && (
                    <div className="flex lg:flex-row flex-col md:flex-row gap-5 mt-6">
                        <Link to='/student-admission'><button className="bg-[#09B451] rounded text-[#001B07] py-2 px-5">Student Admission</button></Link>
                        <Link to='/student-registration'><button className="bg-[#FFFFFF] rounded text-[#09B451] py-2 px-5">Student Registration</button></Link>
                    </div>
                )}
                {about && (
                    <p className='font-bold text-[#F5F5F5] text-[26px] mt-10'>Explore our offerings below</p>
                )}
            </div>
        </div>
    )
}

HeroSection.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  btn: PropTypes.bool,
  about: PropTypes.bool,
};

<HeroSection
  title="Welcome to WiSchool"
  text="Empowering students for a brighter future."
  image="/assets/hero.jpg"
  btn={true}
  about={true}
/>

export default HeroSection


