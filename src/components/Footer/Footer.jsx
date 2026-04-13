import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    return (
        <div className="bg-[#001B07] items-center justify-between text-white py-12 px-10">
            <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Column 1 */}
                <div>
                    <div className='flex flex-row gap-2 items-center'>
                        <img src='logo.png' className='w-8 h-8' />
                        <img src='/frameLogo.png' className='w-[117px] h-[36px]' />
                    </div>
                    <p className="mt-2 text-[#FFFFFF] w-[250px] text-[16px]">We are not here to sell you products, we sell value through our expertise.</p>

                    <div className="flex mt-5 space-x-4 text-xl">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <FaFacebook className="text-[#FFFFFF] hover:text-[#FFFFFF]" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <FaTwitter className="text-[#FFFFFF] hover:text-[#FFFFFF]" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <FaInstagram className="text-[#FFFFFF] hover:text-[#FFFFFF]" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin className="text-[#FFFFFF] hover:text-[#FFFFFF]" />
                        </a>
                    </div>
                </div>

                {/* Column 2 */}
                <div>
                    <h4 className="text-xl font-semibold">Address</h4>
                    <p className="text-[#FFFFFF] text-[16px] mt-1">38 opebi Road, Ikeja, Lagos State, Nigeia.</p>
                    <h4 className="text-xl font-semibold mt-4">Phone:</h4>
                    <p className="text-[#FFFFFF] text-[16px] mt-1">+2349022396389</p>
                    <h4 className="text-xl font-semibold mt-4">Email:</h4>
                    <p className="text-[#FFFFFF] text-[16px] mt-1">contact@contentionary.com</p>
                </div>

                {/* Column 3 */}
                <div>
                    <h3 className="text-xl font-semibold">Company</h3>
                    <p className="mt-2 text-[#FFFFFF] text-[16px] cursor-pointer hover:text-green-400">About us</p>
                    <p className="mt-2 text-[#FFFFFF] text-[16px] cursor-pointer hover:text-green-400">News/Event</p>
                    <p className="mt-2 text-[#FFFFFF] text-[16px] cursor-pointer hover:text-green-400">Blog</p>
                    <p className="mt-2 text-[#FFFFFF] text-[16px] cursor-pointer hover:text-green-400">School Calendar</p>
                </div>
            </div>

            {/* Subscribe Section */}
            <div className="mt-8 text-center">
                <h2 className="text-[25px]">Subscribe to get the latest updates</h2>
                <div className="mt-4 w-[50%] mx-auto rounded bg-[#F9F9F9] flex justify-center">
                    <input
                        type="email"
                        placeholder="Your email"
                        className="p-3 placeholder:text-[#737373] text-black outline-0 rounded-l w-full"
                    />
                    <button className="bg-[#09B451] text-white p-3">Subscribe</button>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="mt-8  pt-4 text-left">
                <h2 className="text-[#FFFFFF]">
                    Powered by <span className="font-bold  mr-2">Scholastify360</span> <span className="text-green-400 underline cursor-pointer hover:underline">Visit our website</span>
                </h2>
            </div>

        </div>
    );
};

export default Footer;
