import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { ArrowLeft, Clock, Tag, Share2 } from "lucide-react";
import { useState } from "react";

export default function BlogDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const blog = location.state;
  const [copied, setCopied] = useState(false);

  function handleShare() {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh] px-5">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Article Not Found</h2>
            <p className="text-gray-500 text-sm mb-5">This article may have been removed or the link is invalid.</p>
            <button
              type="button"
              onClick={() => navigate("/blog")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 text-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero image */}
      <div className="w-full h-72 sm:h-96 mt-[65px] overflow-hidden relative">
        {blog.image && (
          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-4xl mx-auto">
            {blog.category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full mb-3">
                <Tag className="w-3 h-3" /> {blog.category}
              </span>
            )}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">{blog.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 lg:px-10 py-10">
        {/* Back + meta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <button
            type="button"
            onClick={() => navigate("/blog")}
            className="inline-flex items-center gap-2 text-green-600 font-semibold text-sm hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <Share2 className="w-4 h-4" />
            {copied ? "Copied!" : "Share"}
          </button>
        </div>

        {/* Author + meta */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
          <div className="w-12 h-12 rounded-2xl bg-green-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {String(blog.author || "A").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{blog.author || "WiSchool Editorial"}</p>
            <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
              <span>{blog.date}</span>
              {blog.readTime && (
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {blog.readTime}</span>
              )}
            </div>
          </div>
        </div>

        {/* Article body */}
        <article className="prose prose-sm sm:prose-base max-w-none">
          {/* Description lead */}
          {blog.description && (
            <p className="text-lg font-medium text-gray-700 leading-relaxed mb-6 border-l-4 border-green-500 pl-4 italic">
              {blog.description}
            </p>
          )}

          {/* Content */}
          {blog.content ? (
            <div className="text-gray-600 leading-relaxed space-y-4">
              {blog.content.split(/\n+/).filter(Boolean).map((para: string, i: number) => (
                <p key={i} className="text-gray-600 leading-relaxed">{para}</p>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No article content available.</p>
          )}
        </article>

        {/* Tags */}
        {blog.category && (
          <div className="mt-8 pt-6 border-t border-gray-200 flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Category:</span>
            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">{blog.category}</span>
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 bg-green-50 border border-green-100 rounded-2xl p-6 text-center">
          <p className="font-bold text-green-800 mb-1">Enjoyed this article?</p>
          <p className="text-green-700 text-sm mb-4">Subscribe to our newsletter to get more stories like this.</p>
          <div className="flex gap-2 max-w-sm mx-auto">
            <input type="email" placeholder="Your email address" className="flex-1 border border-green-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 bg-white" />
            <button type="button" className="px-5 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 cursor-pointer">Subscribe</button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}