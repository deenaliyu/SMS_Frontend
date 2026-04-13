import { Link } from "react-router-dom";
import { GraduationCap, BookOpenCheck, Users, ArrowRight } from "lucide-react";

const FEATURES = [
  { Icon: GraduationCap, title: "Expert Instructors", desc: "Qualified, experienced teachers dedicated to student success and academic excellence." },
  { Icon: BookOpenCheck, title: "Rich Curriculum", desc: "Comprehensive programs spanning primary through secondary levels with modern learning tools." },
  { Icon: Users, title: "Vibrant Community", desc: "A diverse, inclusive school community that nurtures growth inside and outside the classroom." },
];

export default function Hero() {
  return (
    <>
      {/* Hero banner */}
      <div
        className="relative min-h-[560px] sm:min-h-[640px] flex items-center mt-[65px]"
        style={{
          background: "linear-gradient(135deg, #0d3321 0%, #0a4020 50%, #061a10 100%)",
        }}
      >
        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-green-400/5 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-10 py-20 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left text */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/15 border border-green-500/30 text-green-400 text-xs font-semibold rounded-full mb-5 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Admissions Open — 2025/2026
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
                Welcome to{" "}
                <span className="text-green-400">WiSchool</span>
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-gray-300 mb-3">
                Where Learning Comes Alive!
              </p>
              <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-lg">
                Empowering the next generation with world-class education, innovative programs, and a nurturing community since 2008.
              </p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <Link
                  to="/student-admission"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 transition-all shadow-lg shadow-green-900/40 text-sm"
                >
                  Apply Now <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors text-sm backdrop-blur-sm"
                >
                  Learn More
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-10 justify-center lg:justify-start">
                {[["5,000+", "Students"], ["200+", "Staff"], ["15+", "Years"]].map(([num, label]) => (
                  <div key={label}>
                    <p className="text-2xl font-extrabold text-green-400">{num}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right illustration placeholder */}
            <div className="flex-1 flex justify-center">
              <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-3xl bg-gradient-to-br from-green-600/20 to-green-900/40 border border-green-500/20 flex items-center justify-center">
                <GraduationCap className="w-32 h-32 text-green-500/30" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-green-200 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                <Icon className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}