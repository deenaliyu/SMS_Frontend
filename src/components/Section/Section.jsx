import { Link } from "react-router-dom";
import { Quote, ArrowRight } from "lucide-react";

const STATS = [
  { value: "5,000+", label: "Students Enrolled" },
  { value: "200+", label: "Qualified Staff" },
  { value: "100+", label: "Happy Parents" },
  { value: "25K+", label: "Alumni Worldwide" },
];

const TESTIMONIALS = [
  {
    quote: "WiSchool has truly changed my child's life. The dedication of the staff is unmatched and the results show!",
    name: "Mrs. Fatima Danladi",
    role: "Parent — SS2 Student",
    color: "bg-green-600",
  },
  {
    quote: "An amazing place for learning. My child has grown so much academically, socially, and in confidence.",
    name: "Mr. Emmanuel Okafor",
    role: "Parent — JSS1 Student",
    color: "bg-slate-700",
  },
  {
    quote: "A wonderful institution that truly cares about the well-being and future of every student.",
    name: "Hajiya Zainab Sani",
    role: "Parent — SSS3 Student",
    color: "bg-green-800",
  },
];

const TEAM = [
  { name: "Dr. Adamu Yabagi", role: "Principal", initials: "AY" },
  { name: "Mrs. Ngozi Eze", role: "Vice Principal", initials: "NE" },
  { name: "Mr. Tunde Adebayo", role: "Head of Sciences", initials: "TA" },
  { name: "Ms. Kemi Olatunji", role: "Head of Arts", initials: "KO" },
];

function Avatar({ initials, color = "#16a34a" }) {
  return (
    <div
      className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl shadow-md"
      style={{ background: `linear-gradient(135deg, ${color}, ${color}aa)` }}
    >
      {initials}
    </div>
  );
}

export default function Section() {
  return (
    <div className="bg-white">
      {/* Stats bar */}
      <div className="bg-green-600 py-10">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl sm:text-4xl font-extrabold">{value}</p>
                <p className="text-green-200 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About blurb */}
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-green-600 text-sm font-semibold uppercase tracking-widest mb-3">Why Choose WiSchool</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-5 leading-tight">
              We Are Experts in<br />Quality Education
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-6">
              WiSchool Academy combines a rigorous academic curriculum with character development, technology integration, and holistic student support. We believe every child deserves an education that unlocks their unique potential.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Accredited by the Ministry of Education",
                "State-of-the-art science and technology labs",
                "Dedicated counselling and support services",
                "Active parent-teacher partnership programs",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="w-5 h-5 rounded-full bg-green-100 border border-green-300 flex items-center justify-center flex-shrink-0">
                    <span className="w-2 h-2 rounded-full bg-green-600" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors text-sm"
            >
              Learn More About Us <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Placeholder image area */}
          <div className="relative">
            <div className="w-full h-80 rounded-3xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl text-white">🎓</span>
                </div>
                <p className="text-green-800 font-semibold">WiSchool Campus</p>
                <p className="text-green-600/70 text-sm">Kano, Nigeria</p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg border border-gray-100 px-5 py-3">
              <p className="text-2xl font-extrabold text-green-600">15+</p>
              <p className="text-xs text-gray-500">Years of Excellence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <div className="text-center mb-12">
            <p className="text-green-600 text-sm font-semibold uppercase tracking-widest mb-2">Testimonials</p>
            <h2 className="text-3xl font-extrabold text-gray-900">What Parents Are Saying</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ quote, name, role, color }) => (
              <div key={name} className={`${color} text-white rounded-2xl p-6 shadow-md`}>
                <Quote className="w-8 h-8 text-white/30 mb-4" />
                <p className="text-sm leading-relaxed mb-6 text-white/90 italic">"{quote}"</p>
                <div>
                  <p className="font-semibold text-sm">{name}</p>
                  <p className="text-xs text-white/60">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="py-20 max-w-7xl mx-auto px-5 lg:px-10">
        <div className="text-center mb-12">
          <p className="text-green-600 text-sm font-semibold uppercase tracking-widest mb-2">Leadership</p>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Our Top Educators</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Recognizing excellence in teaching to inspire student achievement and success.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {TEAM.map(({ name, role, initials }, i) => (
            <div key={name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md transition-shadow">
              <Avatar initials={initials} color={["#16a34a", "#1d4ed8", "#7c3aed", "#0891b2"][i]} />
              <h3 className="font-bold text-gray-900 text-sm">{name}</h3>
              <p className="text-gray-500 text-xs mt-0.5">{role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="bg-green-600 py-16">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <h2 className="text-2xl font-extrabold text-white mb-2">Stay Connected</h2>
          <p className="text-green-100 text-sm mb-6">Subscribe to receive school news, events, and announcements directly to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-xl border-0 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="button"
              className="px-5 py-3 bg-white text-green-700 font-bold rounded-xl hover:bg-green-50 transition-colors text-sm cursor-pointer flex-shrink-0"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}