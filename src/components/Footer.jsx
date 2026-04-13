/* eslint-disable no-unused-vars */
import React from 'react';

const Footer = () => {
    return (
        <div className="bg-amber-100 text-gray-900 py-12 px-6">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                {/* Column 1 */}
                <div>
                    <h1 className="text-3xl text-purple-500 font-bold">WiSchool</h1>
                    <p className="mt-2 text-gray-400">We are not here to sell you products, we sell value through our expertise.</p>
                </div>

                {/* Column 2 */}
                <div>
                    <h4 className="text-xl font-semibold">Address</h4>
                    <p className="text-gray-400 mt-1">40, Opedi Road, Steamledge, Kano</p>
                    <h4 className="text-xl font-semibold mt-4">Phone:</h4>
                    <p className="text-gray-400 mt-1">+234 000 000 000</p>
                    <h4 className="text-xl font-semibold mt-4">Email:</h4>
                    <p className="text-gray-400 mt-1">steamledge@gmail.com</p>
                </div>

                {/* Column 3 */}
                <div>
                    <h3 className="text-xl font-semibold">Company</h3>
                    <p className="mt-2 text-gray-400 cursor-pointer hover:text-green-400">About us</p>
                    <p className="mt-2 text-gray-400 cursor-pointer hover:text-green-400">News/Event</p>
                    <p className="mt-2 text-gray-400 cursor-pointer hover:text-green-400">Blog</p>
                    <p className="mt-2 text-gray-400 cursor-pointer hover:text-green-400">School Calendar</p>
                </div>
            </div>

            {/* Subscribe Section */}
            <div className="mt-8 text-center">
                <h2 className="text-xl font-semibold">Subscribe to get the latest updates</h2>
                <form className="flex flex-col items-center justify-center md:flex-row mt-4 gap-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full md:w-1/3 px-4 py-2 text-gray-900 rounded-md bg-white text-center focus:outline-none"
                    />
                    <button type="submit" className="bg-green-500 hover:bg-green-600 text-white text-center px-6 py-2 rounded-md transition">
                        Subscribe
                    </button>
                </form>
            </div>

            {/* Footer Bottom */}
            <div className="mt-8 border-t border-gray-700 pt-4 text-left">
                <h2 className="text-gray-400">
                    Powered by <span className="text-green-400 cursor-pointer hover:underline">Scholastify360</span>
                </h2>
            </div>
        </div>
    );
};

export default Footer;