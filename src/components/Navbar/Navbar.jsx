import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { GraduationCap, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/academics", label: "Academics" },
  { to: "/about", label: "About Us" },
  { to: "/admission", label: "Admission" },
  { to: "/gallery", label: "Gallery" },
  { to: "/news-event", label: "News & Events" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 left-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-5 lg:px-10 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 leading-tight text-base">WiSchool</p>
            <p className="text-[9px] uppercase tracking-widest text-green-600/70 leading-none">Academy</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${isActive(to)
                  ? "text-green-700 bg-green-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}
              `}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/admin-login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Admin
          </Link>
          <Link
            to="/student-login"
            className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-sm shadow-green-900/20"
          >
            Student Login
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-3 space-y-0.5">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`
                  block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
                  ${isActive(to)
                    ? "text-green-700 bg-green-50"
                    : "text-gray-600 hover:bg-gray-50"}
                `}
              >
                {label}
              </Link>
            ))}
            <div className="pt-3 pb-1 border-t border-gray-100 mt-2 flex flex-col gap-2">
              <Link
                to="/admin-login"
                onClick={() => setMenuOpen(false)}
                className="block text-center py-2 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50"
              >
                Admin Login
              </Link>
              <Link
                to="/student-login"
                onClick={() => setMenuOpen(false)}
                className="block text-center py-2 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700"
              >
                Student Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}