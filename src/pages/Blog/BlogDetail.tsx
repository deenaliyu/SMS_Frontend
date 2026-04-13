import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import AdmissionHeader from "../../components/AdmissionHeader/header";
import { HiDownload } from "react-icons/hi";
import { BsUpload } from "react-icons/bs";
import BlogSection from "../../components/BlogSection";

const BlogDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const blog = location.state; // Get the blog data passed via navigate()

  if (!blog) {
    return (
      <div className="text-center text-xl mt-10">
        Blog not found.{" "}
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 underline"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <>
      <AdmissionHeader page="Blog" title="Read" />
      <div className="p-12">
        <div>
          <h2 className="text-[#232A31] w-[90%] text-[42px] font-bold">
            {blog.title}
          </h2>
          <h2 className="text-[#232A31] w-[90%] text-[42px] font-bold">
            {blog.sub}
          </h2>
          <p className="text-[#5B636A] w-[80%] text-[24px]">
            {blog.description}
          </p>
        </div>

        <div className="flex justify-between items-center my-10 lg:w-[600px] md:w-[600px] sm:w-[60%]">
          <div className="flex gap-4">
            {/* <div className="border rounded-full flex p-2"> */}
            <img
              src="/imageAuthor.png"
              className="w-12 h-12 border-2 border-[#A709B4] rounded-full"
            />
            {/* </div> */}
            <div className="flex flex-col">
              <p className="text-[#000000] text-[13.5px] font-bold">
                {blog.author} News
              </p>
              <p className="text-[#232A31] text-[10px] font-bold">
                News Editor
              </p>
              <p className="text-[#5B636A] text-[10px]">{blog.date}</p>
            </div>
          </div>
          <div className="rounded-full bg-[#F5F8FA] p-4">
            <BsUpload size="20" />
          </div>
        </div>

        <div className="p-4">
          <img
            src={blog.image}
            alt={blog.title}
            className="lg:w-[600px] md:w-[600px] h-[500px] rounded"
          />
          <p className="mt-4 text-[#1D2228]  text-[18px]">{blog.content}</p>
        </div>

        <div className=" h-3 bg-[#09B451]"></div>
        <h3 className="text-[#323533] text-[34px] font-bold">Latest Stories</h3>
        <BlogSection show={false} />
      </div>
    </>
  );
};

export default BlogDetail;
