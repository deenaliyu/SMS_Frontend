/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sec2 from '../../assets/Sec2.png';
import Tutor1 from '../../assets/Tutor1.png';
import Tutor2 from '../../assets/Tutor2.png';
import Tutor3 from '../../assets/Tutor3.png';
import AboutImg from '../../assets/About.png';
import HeroSection from '../../components/HeroSection';
import { RedLine } from '../../components/RedLine';



const tutorData = [
    { name: 'John Doe', subject: 'Qualification', image: Tutor1 },
    { name: 'Julian Jameson', subject: 'Qualification', image: Tutor3 },
    { name: 'Julian Jameson', subject: 'Qualification', image: "user-cover-3.png" },
    { name: 'Julian Jameson', subject: 'Profession', image: Tutor2 },
    { name: 'Julian Jameson', subject: 'Qualification', image: Tutor1 },
    { name: 'Julian Jameson', subject: 'Qualification', image: Tutor3 },
    { name: 'Julian Jameson', subject: 'Qualification', image: "user-cover-3.png" },
    { name: 'Julian Jameson', subject: 'Profession', image: Tutor2 },
]

const About = () => {
    return (
        <>
            <Navbar />
            <HeroSection title="About Us" text="At WiSchool, we are dedicated to providing a nurturing and inclusive learning environment where every student can thrive academically, socially, and emotionally. Our commitment to excellence is reflected in our mission, vision, and the dedication of our leadership team and faculty" image={AboutImg} />


            {/* Mission/Vision Section */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className='md:pl-10'>
                        <h2 className="text-2xl md:text-[28px] font-bold text-[#323533]">Mission/Vision</h2>
                        <RedLine />
                        <h3 className="text-[18px] text-[#026229] font-bold mt-4">Mission</h3>
                        <p className="text-[#737373] mt-2 text-[12px]">
                            Empowering students to reach their full potential through innovative education, personalized support, and a commitment to excellence.
                        </p>
                        <h3 className="text-[18px] text-[#026229] font-bold mt-6">Vision</h3>
                        <p className="text-[#737373] mt-2 text-[12px]">
                            To be a leading educational institution that inspires lifelong learning, fosters creativity and critical thinking, and prepares students to succeed in a global society.
                        </p>
                    </div>
                    <div>
                        <img src="/contactImage2.png" alt="Mission" className="  mx-auto" />
                    </div>
                </div>
            </div>

            {/* Director's Message Section */}
            <div className="py-10">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <img src="/contactImage2.png" alt="Director's Message" className="mx-auto " />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-[28px] font-bold text-[#323533]">Director's Message</h2>
                        <RedLine />
                        <p className="text-[#737373] mt-4 text-sm md:text-base">
                            Welcome to WiSchool! As the Director of WiSchool, it gives me great pleasure to welcome you to our vibrant learning community. At WiSchool, we are committed to providing a holistic education that fosters academic excellence, creativity, and character development. Our dedicated team of educators works tirelessly to ensure that every student receives personalized support and opportunities to thrive. Together, we strive to inspire a love for learning and equip students with the skills and knowledge they need to succeed in an ever-changing world. We look forward to partnering with you on this exciting journey of discovery and growth.
                        </p>
                        <p className="text-[#737373] mt-6 text-sm md:text-base">Warm regards<br /> Danjuma Gboyako<br /> Director</p>
                    </div>
                </div>
            </div>

            {/* Principals's Message Section */}
            <div className="py-10">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">

                    <div className='px-6'>
                        <h2 className="text-2xl md:text-[28px] font-bold text-[#323533]">Director's Message</h2>
                        <RedLine />
                        <p className="text-[#737373] mt-4 text-sm md:text-base">Dear Students, Parents, and Visitors,</p>
                        <p className="text-[#737373] mt-4 text-sm md:text-base">
                            Welcome to WiSchool, where learning comes alive! As the Principal, I am thrilled to welcome you to our school community. At WiSchool, we believe in nurturing the whole child - academically, socially, and emotionally. Our dedicated faculty and staff are committed to providing a supportive and inclusive learning environment where every student feels valued, challenged, and inspired to reach their full potential. Whether it's in the classroom, on the playing field, or in the community, we encourage our students to embrace new opportunities, explore their interests, and strive for excellence in all that they do. I am excited to embark on this journey with you and look forward to celebrating your successes along the way.
                        </p>
                        <p className="text-[#737373] mt-6 text-sm md:text-base">Sincerely,<br /> Adamu Yabagi<br /> Director</p>
                    </div>
                    <div>
                        <img src="/contactImage2.png" alt="Director's Message" className="mx-auto " />
                    </div>
                </div>
            </div>

            {/* Faculty & Staff Section */}
            <div className="container mx-auto md:px-26 py-12">
                <h2 className="text-2xl md:text-[22px] font-bold text-[#252B42] text-left">Faculty & Staff</h2>
                <p className="text-[#737373] text-left text-sm mt-2 ">
                    Meet the dedicated educators who make WiSchool a vibrant and supportive learning community.
                </p>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-1 gap-y-4">
                    {tutorData.map((tutor, index) => (
                        <div key={index} className="bg-white shadow-lg rounded-2xl w-[220px] text-center">
                            <img src={tutor.image} alt={`Photo of ${tutor.name}`} className="mx-auto rounded-t-2xl w-full" />
                            <div className='p-5'>
                                <h3 className="text-[16px] font-bold  text-[#09B451]">{tutor.name}</h3>
                                <p className="text-[#737373] text-[13px]">{tutor.subject}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default About;