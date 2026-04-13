import { Link } from "react-router-dom";
import ContactForm from "../../components/Contact";
import HeroSection from "../../components/HeroSection";

const Admission = () => {
    return (
        <div className="">

            {/* Hero Section */}

            <HeroSection title="Admission" text="Welcome to the WiSchool Admission page! We are excited that you are considering joining our vibrant learning community. Below, you will find information about our admission process, requirements, and how to apply. If you have any questions or need assistance, please don't hesitate to contact us." image="contactImage.png" btn />

            <div className="mt-7 p-6 flex flex-col justify-center items-center">
                <h3 className="text-[#001B07] text-[22px]">Check Admission Status</h3>
                <div className="w-[50%]">
                    <h4 className="text-[#001B07] text-[16px] py-3">Admission Number</h4>
                    <div className="border flex border-[#E6E6E6] rounded bg-[#F9F9F9] h-[40px] justify-between w-full">
                        <input type="text" className="h-full p-2" placeholder="Admission Number" />
                        <button className="bg-[#09B451] p-2 h-full text-[#FFFFFF]">Check status</button>
                    </div>
                </div>
            </div>

            {/* Send Us a Message */}
            <ContactForm title="Contact Us" />
        </div >
    );
};

export default Admission;