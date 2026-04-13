import PropTypes from "prop-types";
import { Link } from "react-router-dom";

/**
 * HeroSection — shared page hero used by About, Academics, Blog, Contact, Gallery, News.
 *
 * Props:
 *  title     – main heading
 *  text      – subtitle paragraph
 *  image     – background image URL
 *  btn       – show admission CTA buttons
 *  compact   – shorter height variant
 */
export default function HeroSection({ title, text, image, btn = false, compact = false }) {
  return (
    <div
      className={`relative flex items-end ${compact ? "min-h-[280px]" : "min-h-[420px] sm:min-h-[500px]"} mt-[65px]`}
      style={{
        backgroundImage: image ? `url(${image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: image ? undefined : "#0d3321",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 lg:px-10 pb-12 pt-20">
        <div className="max-w-2xl">
          <p className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-3">
            WiSchool Academy
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-4">
            {title}
          </h1>
          {text && (
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6 max-w-xl">
              {text}
            </p>
          )}
          {btn && (
            <div className="flex flex-wrap gap-3">
              <Link
                to="/student-admission"
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-900/40 text-sm"
              >
                Apply for Admission
              </Link>
              <Link
                to="/student-registration"
                className="px-6 py-3 bg-white/15 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/25 transition-colors text-sm backdrop-blur-sm"
              >
                Student Registration
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

HeroSection.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
  image: PropTypes.string,
  btn: PropTypes.bool,
  compact: PropTypes.bool,
};