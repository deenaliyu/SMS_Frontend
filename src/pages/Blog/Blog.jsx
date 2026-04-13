import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import HeroSection from "../../components/HeroSection";
import { Clock, ArrowRight, Tag } from "lucide-react";

const BLOGS = [
  {
    id: 1,
    category: "STEM Education",
    title: "Unlocking the Power of STEM Education",
    sub: "Fostering Creativity and Innovation in the Classroom",
    author: "Mrs. Amina Bello",
    date: "Mon, Mar 10, 2025, 9:00 AM",
    readTime: "5 min read",
    description:
      "STEM education plays a crucial role in preparing students for success in the 21st century by integrating science, technology, engineering, and mathematics in meaningful, hands-on ways.",
    content:
      "In today's rapidly evolving world, STEM education plays a crucial role in preparing students for success. By integrating science, technology, engineering, and mathematics into the curriculum, educators inspire curiosity, foster critical thinking, and ignite a passion for discovery. At WiSchool, our commitment to STEM is reflected in innovative programs, hands-on learning experiences, and dedicated faculty who inspire students to explore, experiment, and excel.",
    image: "https://picsum.photos/seed/stem101/800/500",
  },
  {
    id: 2,
    category: "Character Development",
    title: "Building Character: Beyond Academic Excellence",
    sub: "Why values and ethics matter as much as grades",
    author: "Mr. Tunde Adebayo",
    date: "Wed, Apr 2, 2025, 8:00 AM",
    readTime: "4 min read",
    description:
      "Academic performance is vital, but character shapes a child's entire life. Discover how WiSchool integrates values, empathy, and leadership into daily school life.",
    content:
      "Grades tell only part of a student's story. At WiSchool, we believe character development is equally important — perhaps more so. Through mentorship programs, community service, and structured ethical discussions, students learn respect, responsibility, and resilience. These values compound over time, shaping young people into leaders their communities can depend on.",
    image: "https://picsum.photos/seed/char202/800/500",
  },
  {
    id: 3,
    category: "Technology",
    title: "Technology in the Modern Classroom",
    sub: "How digital tools are transforming learning outcomes",
    author: "Mr. Chukwuemeka Eze",
    date: "Fri, Apr 18, 2025, 10:30 AM",
    readTime: "6 min read",
    description:
      "From smart boards to coding clubs, technology is reshaping how WiSchool students learn, collaborate, and prepare for an increasingly digital world.",
    content:
      "The modern classroom looks very different from classrooms of twenty years ago. At WiSchool, students use tablets for interactive learning, participate in coding workshops, and access digital libraries. This exposure doesn't just improve academic outcomes — it builds the digital fluency that employers will expect from tomorrow's workforce.",
    image: "https://picsum.photos/seed/tech303/800/500",
  },
  {
    id: 4,
    category: "Community",
    title: "Parent-Teacher Partnership: Key to Student Success",
    sub: "Building a bridge between home and school",
    author: "Mrs. Ngozi Eze",
    date: "Tue, May 6, 2025, 7:00 AM",
    readTime: "3 min read",
    description:
      "Research consistently shows that students thrive when parents and teachers work together. WiSchool's collaborative approach is making a measurable difference.",
    content:
      "When parents and teachers form genuine partnerships, students benefit enormously. WiSchool's Parent-Teacher Association meets regularly, shares academic updates through our digital portal, and co-organises events that bring families into the learning journey. This open communication model removes guesswork and ensures no student is left behind.",
    image: "https://picsum.photos/seed/comm404/800/500",
  },
  {
    id: 5,
    category: "Career Readiness",
    title: "Preparing Students for 21st Century Careers",
    sub: "Skills that employers actually want from graduates",
    author: "Dr. Adamu Yabagi",
    date: "Mon, May 19, 2025, 9:00 AM",
    readTime: "7 min read",
    description:
      "The careers of tomorrow require creativity, collaboration, and critical thinking. Here's how WiSchool is equipping students with skills that go beyond textbook knowledge.",
    content:
      "The World Economic Forum identifies critical thinking, creativity, and emotional intelligence as the top skills employers will seek in the next decade. WiSchool's curriculum is deliberately designed around these competencies. Through project-based assessments, debate competitions, entrepreneurship clubs, and career fairs with industry guests, students graduate ready to contribute meaningfully to the workforce.",
    image: "https://picsum.photos/seed/career505/800/500",
  },
  {
    id: 6,
    category: "Health & Wellness",
    title: "The Importance of Physical Education",
    sub: "A healthy body fuels a sharper mind",
    author: "Coach Bola Salami",
    date: "Thu, Jun 5, 2025, 11:00 AM",
    readTime: "4 min read",
    description:
      "Physical education is far more than sports — it builds discipline, teamwork, and mental resilience that transfer directly into academic performance.",
    content:
      "Physical activity has a direct, proven impact on brain function. Students who exercise regularly demonstrate better concentration, improved memory retention, and lower stress levels. At WiSchool, our PE program encompasses athletics, team sports, and mindfulness sessions designed to keep students physically and mentally in peak condition throughout the academic year.",
    image: "https://picsum.photos/seed/phys606/800/500",
  },
];

const CATEGORIES = ["All", ...new Set(BLOGS.map((b) => b.category))];

export default function Blog() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [visible, setVisible] = useState(4);

  const filtered = activeCategory === "All" ? BLOGS : BLOGS.filter((b) => b.category === activeCategory);
  const shown = filtered.slice(0, visible);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <HeroSection
        title="Our Blog"
        text="Insights, news, and stories from WiSchool — for students, parents, and educators."
        image="https://picsum.photos/seed/blog-hero/1600/600"
      />

      {/* Category filter */}
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => { setActiveCategory(cat); setVisible(4); }}
              className={`
                px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer
                ${activeCategory === cat
                  ? "bg-green-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700"}
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog grid */}
      <div className="max-w-7xl mx-auto px-5 lg:px-10 pb-16">
        {/* Featured post */}
        {shown.length > 0 && (
          <div
            className="mb-8 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/blog/${shown[0].id}`, { state: shown[0] })}
          >
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2">
                <img
                  src={shown[0].image}
                  alt={shown[0].title}
                  className="w-full h-64 lg:h-full object-cover"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
              <div className="lg:w-1/2 p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    {shown[0].category}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {shown[0].readTime}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2 leading-tight">
                  {shown[0].title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{shown[0].description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{shown[0].author}</p>
                    <p className="text-xs text-gray-400">{shown[0].date}</p>
                  </div>
                  <span className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                    Read more <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.slice(1).map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 cursor-pointer transition-all"
              onClick={() => navigate(`/blog/${blog.id}`, { state: blog })}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.src = `https://picsum.photos/seed/${blog.id}/800/400`; }}
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 bg-green-50 text-green-700 text-[11px] font-semibold rounded-full flex items-center gap-1">
                    <Tag className="w-2.5 h-2.5" /> {blog.category}
                  </span>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> {blog.readTime}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2 leading-tight line-clamp-2">{blog.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{blog.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">{blog.author}</p>
                  <ArrowRight className="w-4 h-4 text-green-500" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        {visible < filtered.length && (
          <div className="text-center mt-10">
            <button
              type="button"
              onClick={() => setVisible((v) => v + 3)}
              className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-green-300 transition-all text-sm cursor-pointer shadow-sm"
            >
              Load More Posts
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}