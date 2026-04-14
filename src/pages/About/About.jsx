import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import HeroSection from "../../components/HeroSection";
import { ArrowRight, BookOpenCheck, GraduationCap, Users } from "lucide-react";
import { Link } from "react-router-dom";

const TEAM = [
  { name: "Dr. Adamu Yabagi", role: "Principal / Director", initials: "AY", color: "#16a34a" },
  { name: "Mrs. Ngozi Eze", role: "Vice Principal Academics", initials: "NE", color: "#1d4ed8" },
  { name: "Mr. Tunde Adebayo", role: "Head of Sciences", initials: "TA", color: "#7c3aed" },
  { name: "Ms. Kemi Olatunji", role: "Head of Arts & Social", initials: "KO", color: "#0891b2" },
  { name: "Mr. Emeka Okafor", role: "Head of Technology", initials: "EO", color: "#d97706" },
  { name: "Mrs. Fatima Sani", role: "Head of Languages", initials: "FS", color: "#be185d" },
  { name: "Mr. Samuel Edet", role: "Sports Coordinator", initials: "SE", color: "#0f766e" },
  { name: "Ms. Blessing Musa", role: "Student Affairs Officer", initials: "BM", color: "#c2410c" },
];

function TeamCard({ name, role, initials, color }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 text-center hover:shadow-md transition-shadow">
      <div
        className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center text-white font-bold text-xl shadow-md"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}aa)` }}
      >
        {initials}
      </div>
      <p className="font-bold text-gray-900 text-sm">{name}</p>
      <p className="text-gray-500 text-xs mt-0.5">{role}</p>
    </div>
  );
}

function SectionHeader({ label, title, subtitle }) {
  return (
    <div className="text-center mb-10">
      {label && <p className="text-green-600 text-xs font-semibold uppercase tracking-widest mb-2">{label}</p>}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{title}</h2>
      {subtitle && <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">{subtitle}</p>}
    </div>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <HeroSection
        title="About WiSchool"
        text="Dedicated to providing a nurturing, inclusive learning environment where every student can thrive academically, socially, and emotionally."
        image="https://picsum.photos/seed/about-hero/1600/600"
      />

      {/* Mission / Vision */}
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-green-600 text-xs font-semibold uppercase tracking-widest mb-3">Who We Are</p>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-5 leading-tight">Mission & Vision</h2>

            <div className="space-y-5 mb-6">
              <div className="border-l-4 border-green-500 pl-4">
                <p className="font-bold text-gray-900 mb-1">Our Mission</p>
                <p className="text-gray-500 text-sm leading-relaxed">Empowering students to reach their full potential through innovative education, personalised support, and an unwavering commitment to academic excellence.</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-bold text-gray-900 mb-1">Our Vision</p>
                <p className="text-gray-500 text-sm leading-relaxed">To be a leading educational institution that inspires lifelong learning, fosters creativity and critical thinking, and prepares students to succeed in a global society.</p>
              </div>
            </div>

            <Link to="/student-admission" className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors text-sm">
              Apply Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[["2008", "Founded"], ["5,000+", "Students"], ["200+", "Staff"], ["15+", "Years"], ["98%", "Pass Rate"], ["25K+", "Alumni"]].map(([val, label]) => (
              <div key={label} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-center">
                <p className="text-xl font-extrabold text-green-600">{val}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Director's Message */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="w-full h-72 bg-gradient-to-br from-green-100 to-green-200 rounded-3xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-green-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-3">AY</div>
                <p className="font-bold text-green-800">Dr. Adamu Yabagi</p>
                <p className="text-green-600 text-sm">Principal / Director</p>
              </div>
            </div>
            <div>
              <p className="text-green-600 text-xs font-semibold uppercase tracking-widest mb-3">Director's Message</p>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4 leading-tight">A Word from Our Principal</h2>
              <blockquote className="text-gray-600 text-sm leading-relaxed mb-4 italic border-l-4 border-green-200 pl-4">
                "Welcome to WiSchool! As the Director of WiSchool, it gives me great pleasure to welcome you to our vibrant learning community. Our commitment to excellence is reflected in our mission, vision, and the dedication of our faculty. We look forward to partnering with you on this exciting journey of discovery and growth."
              </blockquote>
              <p className="text-sm text-gray-700 font-medium">Warm regards,<br /><span className="text-green-700">Dr. Adamu Yabagi</span> — Director, WiSchool Academy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-16 max-w-7xl mx-auto px-5 lg:px-10">
        <SectionHeader label="Core Values" title="What We Stand For" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { Icon: GraduationCap, title: "Academic Excellence", desc: "We hold high standards and push every student to reach beyond what they thought possible." },
            { Icon: Users, title: "Inclusive Community", desc: "Every student, teacher, and parent is valued and respected regardless of background." },
            { Icon: BookOpenCheck, title: "Character Development", desc: "We nurture integrity, responsibility, and empathy alongside academic achievement." },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <SectionHeader label="Leadership" title="Faculty & Staff" subtitle="Meet the dedicated educators who make WiSchool a vibrant and supportive learning community." />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {TEAM.map((member) => <TeamCard key={member.name} {...member} />)}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}