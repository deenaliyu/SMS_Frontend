import { Link } from "react-router-dom";
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const QUICK_LINKS = [
  { to: "/about", label: "About Us" },
  { to: "/academics", label: "Academics" },
  { to: "/admission", label: "Admission" },
  { to: "/news-event", label: "News & Events" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

const SOCIAL = [
  { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { Icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { Icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white leading-tight">WiSchool</p>
                <p className="text-[9px] uppercase tracking-widest text-green-500/60">Scholastify360</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Empowering students with world-class education, innovative programs, and a community that nurtures every learner to reach their full potential.
            </p>
            <div className="flex gap-3">
              {SOCIAL.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-green-600 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-gray-400 hover:text-green-400 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Portals</h3>
            <ul className="space-y-2.5">
              {[
                { to: "/student-login", label: "Student Login" },
                { to: "/admin-login", label: "Admin Login" },
                { to: "/student-admission", label: "Apply Now" },
                { to: "/student-registration", label: "Register" },
                { to: "/payment", label: "Online Payment" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-gray-400 hover:text-green-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                15 Education Crescent, Nassarawa GRA, Kano State, Nigeria
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
                +234 801 234 5678
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-green-500 flex-shrink-0" />
                info@wischool.edu.ng
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 max-w-xl">
            <div className="flex-1">
              <p className="text-white font-semibold mb-0.5">Subscribe to our newsletter</p>
              <p className="text-xs text-gray-500">Get updates on events, announcements, and news.</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 bg-gray-800 border border-gray-700 text-sm text-gray-300 rounded-xl focus:outline-none focus:border-green-500 placeholder:text-gray-600 w-48"
              />
              <button
                type="button"
                className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors cursor-pointer"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} WiSchool Academy. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Powered by{" "}
            <span className="text-green-500 font-medium">Scholastify360</span>
            {" "}·{" "}
            <span className="text-gray-700">Built by Steamledge Limited</span>
          </p>
        </div>
      </div>
    </footer>
  );
}