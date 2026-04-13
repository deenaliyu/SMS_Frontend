import React from 'react'
import PropTypes from "prop-types";

const ContactForm = ({ title }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Add form processing logic here
    };

    return (
        <div className="flex p-6 gap-10 items-center flex-col lg:flex-row md:flex-row">
            <div className="p-6 mt-6 lg:w-[60%] md:w-[60%]">
                <h2 className="text-[#323533] text-[28px] font-bold">{title}</h2>
                <p className="text-[#737373] text-[15.5px]">Have a question or comment? Use the form below to send us a message. We'll get back to you as soon as possible!</p>
                <div className="border-t-6 border-[#f61122] w-18 my-4"></div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="text-[#000000] text-[16px] flex flex-col gap-1">First name<input type="text" className="p-3 px-6 border border-[#09B451] rounded w-full" /></label>
                        <label className="text-[#000000] text-[16px] flex flex-col gap-1">Last name<input type="text" className="p-3 px-6 border border-[#09B451] rounded w-full" /></label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="text-[#000000] text-[16px] flex flex-col gap-1">Phone number
                            <input type="tel" className="p-3 px-6 border-[#09B451] border rounded w-full" /></label>
                        <label className="text-[#000000] text-[16px] flex flex-col gap-1">Email
                            <input type="email" className="p-3 px-6 border border-[#09B451] rounded w-full" /></label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="text-[#000000] text-[16px] flex flex-col gap-1">Select service
                            <select className="p-3 border-[#09B451] px-6 border rounded w-full">

                                <option></option>
                                <option>Service 1</option>
                                <option>Service 2</option>
                            </select>
                        </label>
                        <label className="text-[#000000] text-[16px] flex flex-col gap-1">Appointment date
                            <input type="date" placeholder="" className="p-3 border-[#09B451] border pxr-6 rounded w-full" /></label>
                    </div>
                    <label className="text-[#000000] text-[16px] flex flex-col gap-1"   >Message
                        <textarea placeholder="Type your message" className="p-3 border border-[#0093DF] rounded w-full h-42"></textarea></label>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4" />
                        <label className="text-[#000000] text-[14px]">I accept the <span className=" underline">Terms</span></label>
                    </div>
                    <button className="bg-[#09B451] text-[#FFFFFF] text-[16px] py-[16px] px-[28px] rounded ">Submit</button>
                </form>
            </div>
            <div className=" md:w-[30%] lg:w-[30%]">
                <img src="/contactImage2.png" alt="IMAGE" />
            </div>
        </div>
    )
}

ContactForm.propTypes = {
  title: PropTypes.string.isRequired,
};

export default ContactForm