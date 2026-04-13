/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import AboutImg from "../../assets/About.png";
import Sec2 from "../../assets/Sec2.png";
import Tutor1 from "../../assets/Tutor1.png";
import Tutor2 from "../../assets/Tutor2.png";
import Tutor3 from "../../assets/Tutor3.png";
import HeroSection from "../../components/HeroSection";
import { RedLine } from "../../components/RedLine";
import StarRating from "../../components/StarRating";

const tutorData = [
  { name: 'John Doe', subject: 'Profession', image: Tutor1 },
  { name: 'Julian Jameson', subject: 'Profession', image: Tutor3 },
  { name: 'Julian Jameson', subject: 'Profession', image: "user-cover-3.png" },
  { name: 'Julian Jameson', subject: 'Profession', image: Tutor2 },
]

const testimonialData = [
  { name: 'Regina Miles', role: 'Parent', image: "testimonial-user-cover-202.png", text: 'WiSchool has been a game-changer for our child\'s education. The personalized attention and supportive environment have made all the difference.' },
  { name: 'Regina Miles', role: 'Students', image: "testimonial-user-cover-99.png", text: 'Choosing WiSchool was the best decision we made for our family. Our child is thriving academically and socially, thanks to the dedicated staff and engaging curriculum.' },
  { name: 'Regina Miles', role: 'Designer', image: "testimonial-user-cover-86 (1).png", text: 'At WiSchool, every student truly matters. The caring community and focus on individual needs have exceeded our expectations.' },
]

const Academics = () => {
  const productRating = 3.5; // show 3.5 stars for example


  return (
    <>
      <Navbar />
      <HeroSection title="Academics" text="At WiSchool, we're committed to providing a dynamic and enriching academic experience that prepares students for success in an ever-changing world. Our comprehensive academic programs are designed to foster critical thinking, creativity, and a lifelong love for learning. 
" image={AboutImg} about />

      {/* Primary School Curriculum */}
      <div className="max-w-6xl mx-auto px-7 md:px-14 py-12 flex flex-col md:flex-row items-center gap-12">
        <div className="text-left md:w-1/2 space-y-6">
          <h1 className="text-3xl md:text-[30px] font-bold text-[#323533]">Primary School Curriculum</h1>
          <RedLine />
          <p className="text-[#737373] text-[16px]">
            At WiSchool, our primary school curriculum is designed to provide a strong foundation for academic success while nurturing students' curiosity, creativity, and love for learning. Our holistic approach integrates core subjects with hands-on learning experiences and character development initiatives
          </p>
          <h3 className="text-[22px] font-bold text-[#026229]">Core Subjects</h3>
          <ul className="list-disc text-[#737373] text-[16px]">
            <li>Language Arts</li>
            <li>Mathematics</li>
            <li>Science</li>
            <li>Social Studies</li>
            <li>Art</li>
            <li>Physical Education</li>
          </ul>
          <h3 className="text-[22px] font-bold text-[#026229]">Enrichment Programs</h3>
          <ul className="list-disc  text-[#737373] text-[16px] space-y-1">
            <li>STEM Education: Engages students in hands-on learning experiences that integrate science, technology, engineering, and mathematics.</li>
            <li>Environmental Education: Raises awareness of environmental issues and promotes sustainable practices through outdoor exploration and conservation projects.</li>
            <li>Character Education: Fosters values such as respect, responsibility, integrity, and empathy through character-building activities and discussions</li>
          </ul>
          <h3 className="text-[22px] font-bold text-[#026229]">Assessment and Evaluation</h3>
          <ul className="list-disc  text-[#737373] text-[16px] space-y-1">
            <li>Continuous assessment through quizzes, projects, and class participation.
            </li>
            <li>Periodic progress reports and parent-teacher conferences to monitor student growth and address any areas of concern.
            </li>
            <li>Standardized testing to measure student achievement and inform instructional planning</li>
          </ul>
        </div>
        <div className="">
          <img src="contactImage2.png" alt="Primary Education" className="" />
        </div>
      </div>

      {/* Secondary School Curriculum -  */}
      <div className=" py-12 px-6 md:px-12 flex flex-col md:flex-row-reverse items-center gap-12">
        <div className="text-left md:w-1/2 space-y-6">
          <h1 className="text-3xl md:text-[28px] font-bold text-[#323533]">Secondary School Curriculum</h1>
          <RedLine />
          <p className="text-[#737373] text-[13.5px]">
            In our secondary school program, WiSchool offers a rigorous academic curriculum that prepares students for higher education and future careers. Our comprehensive approach emphasizes critical thinking, inquiry-based learning, and real-world application of knowledge
          </p>
          <h3 className="text-[22px] font-bold text-[#026229]">Core Subjects</h3>
          <ul className="list-disc text-[#737373] text-[14px]">
            <li>English Language and Literature</li>
            <li>Mathematics</li>
            <li>Science: Explores advanced scientific principles and methodologies through biology, chemistry, physics, and environmental science.</li>
            <li>Social Sciences: Analyzes historical events, political systems, economic theories, and societal issues through courses in history, geography, economics, and sociology.</li>
            <li>Foreign Languages: Develops proficiency in a second language through courses in language acquisition, literature, and culture.</li>
            <li>Electives: Offers a wide range of elective courses to cater to students' interests and career goals, such as computer science, fine arts, business, and psychology</li>
          </ul>
          <h3 className="text-[22px] font-bold text-[#026229]">Advanced Placement (AP) and Honors Courses</h3>
          <ul className="list-disc  text-[#737373] text-[15px] space-y-1">
            <li>Provides opportunities for motivated students to pursue advanced coursework and earn college credit through AP courses in subjects such as calculus, biology, chemistry, and literature.</li>
            <li>Honors courses offer accelerated and enriched curriculum options for high-achieving students seeking academic challenges and intellectual stimulation</li>
          </ul>
          <h3 className="text-[22px] font-bold text-[#026229]">Extracurricular Opportunities</h3>
          <ul className="list-disc  text-[#737373] text-[14px] space-y-1">
            <li>Clubs and Organizations: Provides opportunities for students to explore their interests and passions outside the classroom through clubs, student organizations, and leadership activities.</li>
            <li>Internships and Work Experience: Offers hands-on learning experiences and real-world exposure through internships, job shadowing, and career exploration programs.</li>
            <li>Community Service and Volunteering: Encourages students to make a positive impact in their communities and develop leadership skills through service-learning projects and volunteer opportunities.</li>
          </ul>
          <h3 className="text-[22px] font-bold text-[#026229]">College and Career Preparation</h3>
          <ul className="list-disc  text-[#737373] text-[14px] space-y-1">
            <li>College Counseling: Guides students through the college application process, including standardized testing, college research, essay writing, and financial aid.</li>
            <li>Career Exploration: Provides resources and support for students to explore potential career paths, develop career readiness skills, and make informed decisions about their future</li>
          </ul>
        </div>
        <div className="">
          <img src="contactImage2.png" alt="Secondary Education" className="" />
        </div>
      </div>

      {/* Faculty Profiles */}
      <div className="py-12 px-6 md:px-12 text-left">
        <h2 className="text-2xl md:text-[22px] font-bold text-[#252B42] text-left">Faculty Profiles</h2>
        <p className="text-[#737373] text-left text-sm mt-2 ">
          Meet the dedicated educators who make WiSchool a vibrant and supportive learning community.
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-1 gap-y-4">
          {tutorData.map((tutor, index) => (
            <div key={index} className="bg-white shadow-lg rounded-2xl w-[220px] text-center">
              <img src={tutor.image} alt="staff" className="mx-auto  rounded-t-2xl w-full" />
              <div className='p-5'>
                <h3 className="text-[16px] font-bold  text-[#09B451]">{tutor.name}</h3>
                <p className="text-[#737373] text-[13px]">{tutor.subject}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Resources */}
      <div className="py-12 px-6 md:px-12 flex flex-col md:flex-row items-center gap-1">
        <div className="">
          <img src="contactImage2.png" alt="Academic Resources" className="" />
        </div>
        <div className="text-left md:w-1/2 space-y-6">
          <h2 className="text-3xl md:text-[30px] font-bold text-[#323533]">Academic Resources</h2>
          <RedLine />
          <ul className="list-disc text-[#737373] text-[14px]">
            <p className="">
              Access a wealth of resources to support student learning and success
            </p>
            <li>Online libraries</li>
            <li>Educational websites</li>
            <li>Study tools</li>
          </ul>
        </div>
      </div>

      {/* Extracurricular Activities -  */}
      <div className="py-12 px-6 md:px-12 flex flex-col md:flex-row-reverse items-center gap-12">
        <div className="">
          <img src="contactImage2.png" alt="Extracurricular Activities" className="" />
        </div>
        <div className="text-left md:w-1/2 space-y-6">
          <h2 className="text-3xl md:text-[28] font-bold text-[#323533]">Extracurricular Activities</h2>
          <RedLine />
          <ul className="list-disc text-[#737373] text-[14px]">
            <p className="">
              Get involved and explore your interests with our wide range of extracurricular activities
            </p>
            <li>Clubs</li>
            <li>Sports Teams</li>
            <li>Arts Programs</li>
          </ul>
        </div>
      </div>

      {/* Testimonials */}
      <div className=" py-12 px-6 ">
        <div className="space-y-2 p-30">
          <h2 className="text-3xl md:text-[28] font-bold text-[#323533]">Testimonials</h2>
          <p className="list-disc text-[#737373] text-[14px]">See what our students and parents have to say about their experiences at WiSchoo</p>

        </div>
        <div className="px-20">
          {/* <div className=" text-center flex flex-col items-center gap-4"> */}
          <div className="md:flex  flex-row gap-40">            {
            testimonialData.map(item => (
              <div className="md:w-[20%] text-center md:flex flex-col items-center gap-4">
                <StarRating rating={Math.round(productRating)} />
                <p className="text-[#737373] text-[14px]">{item.text}</p>
                <div className="flex justify-center items-center mt-5 gap-4">
                  <img src={item.image} />
                  <div className="flex flex-col">
                    <p className="text-[#96BB7C] text-[14px]">{item.name}</p>
                    <p className="text-[#252B42] text-[12px]">{item.role}</p>
                  </div>
                </div>
              </div>
            ))
          }
            {/* </div> */}





          </div>
        </div>
      </div>
    </>
  );
};

export default Academics;
