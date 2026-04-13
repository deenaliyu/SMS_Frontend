import { BiPhone, BiSolidPhone } from "react-icons/bi";
import { GoLocation } from "react-icons/go";
import { HiLocationMarker } from "react-icons/hi";
import { MdMail } from "react-icons/md";
import ContactForm from "../../components/Contact";
import HeroSection from "../../components/HeroSection";
import image from '/contactImage.png'


const Contact = () => {
    return (
        <div className="">
            {/* Hero Section */}
            <HeroSection title="Contact Us" image={image} text="Welcome to the WiSchool Contact Us page! Whether you have questions, feedback, or just want to say hello, we'd love to hear from you. Use the information below to get in touch with our team. We're here to help!" />

            {/* Three Column Section */}
            <div className="grid grid-cols-1 bg-[#A5FFB9] md:grid-cols-3 gap-6 pt-8 pb-20 px-20">
                <div className="p-6 h-40">
                    <div className="flex items-center gap-4">
                        <MdMail color="#09B451" size={38} />
                        <h3 className="text-[32px] font-bold text-[#09B451]">Email</h3>
                        {/* icon */}
                    </div>
                    <p className="text-[#000000] text-[16px] py-3">For general inquiries,please email us at</p>
                    <p className=" underline"><a>info@wiSchool.edu</a></p>
                </div>
                <div className="p-6 h-40">
                    <div className="flex items-center gap-4">
                        <BiSolidPhone color="#09B451" size={38} />
                        <h3 className="text-[32px] font-bold text-[#09B451]">Phone</h3>
                        {/* icon */}
                    </div>
                    <p className="text-[#000000] text-[16px] py-3">To speak with a customer service representative, please call us at</p>
                    <p><a>(555) 123-4567</a></p>
                </div>
                <div className="p-6 h-40">
                    <div className="flex items-center gap-4">
                        <HiLocationMarker color="#09B451" size={38} />
                        <h3 className="text-[32px] font-bold text-[#09B451]">Office</h3>
                        {/* icons */}
                    </div>
                    <p className="text-[#000000] text-[16px] py-3">To visit our office, please come to</p>
                    <p>WiSchool 123 Main Street Cityville, State 12345 Country</p>
                </div>
            </div>

            {/* Office Hours */}
            <div className="p-10">
                <h2 className="text-[34px] text-[#323533] font-bold">Office Hours</h2>
                <p className="text-[#737373] text-[14px]">Monday - Friday: 8:00 AM - 5:00 PM</p>
                <p className="text-[#737373] text-[14px]">Saturday: 9:00 AM - 12:00 PM.</p>
            </div>

            {/* Maps & Directions */}
            <div className="p-8">
                <h2 className="text-[34px] py-4 text-[#323533] font-bold">Map and Directions</h2>
                <iframe

                    className="flex mx-auto w-[90%] h-[60vh]"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2001251.996363329!2d7.1977604828396835!3d11.573686867157598!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x11ac492941faebb7%3A0xb77211b27ef50cdb!2sKano!5e0!3m2!1sen!2sng!4v1738258150350!5m2!1sen!2sng"
                    allowFullScreen
                ></iframe>

            </div>

            {/* Send Us a Message */}
            <ContactForm title="Send Us a Message" />
        </div >
    );
};

export default Contact;
