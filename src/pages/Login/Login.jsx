import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Eye, EyeOff, GraduationCap, ShieldCheck, Users, BookOpen, Award, Mail, Lock } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isAdminUser, isStudentUser } from "../../config/accessControl";
import { smsApi } from "../../services/smsApi";
import { clearAuthSession, setAuthSession } from "../../utils/authSession";

// ── Portal configs ────────────────────────────────────────────────────────────
const ADMIN_CONFIG = {
  portal: "admin",
  Icon: ShieldCheck,
  badge: "Administrator Portal",
  title: "Welcome back",
  subtitle: "Sign in to access the school management dashboard.",
  emailLabel: "Email Address",
  emailType: "email",
  emailPlaceholder: "admin@wischool.edu.ng",
  submitLabel: "Sign In",
  switchPrompt: "Are you a student?",
  switchRoute: "/student-login",
  switchLabel: "Student Login",
  defaultRoute: "/dashboard",
  validateUser: isAdminUser,
  invalidRoleMessage: "This portal is for administrators and staff only.",
  accentFrom: "#1e3a8a",
  accentTo: "#1d4ed8",
  panelStats: [
    { icon: Users,     value: "2,400+", label: "Students Enrolled" },
    { icon: BookOpen,  value: "120+",   label: "Active Courses" },
    { icon: Award,     value: "98%",    label: "Pass Rate" },
  ],
  panelQuote: "Empowering educators with the tools to shape tomorrow's leaders.",
};

const STUDENT_CONFIG = {
  portal: "student",
  Icon: GraduationCap,
  badge: "Student Portal",
  title: "Welcome back",
  subtitle: "Sign in to view your results, timetable, and school notices.",
  emailLabel: "Email or Username",
  emailType: "text",
  emailPlaceholder: "student@wischool.edu.ng",
  submitLabel: "Sign In",
  switchPrompt: "Are you an admin or staff?",
  switchRoute: "/admin-login",
  switchLabel: "Admin Login",
  defaultRoute: "/student-portal",
  validateUser: isStudentUser,
  invalidRoleMessage: "This portal is for students only.",
  accentFrom: "#064e3b",
  accentTo: "#065f46",
  panelStats: [
    { icon: BookOpen,  value: "12",    label: "Subjects This Term" },
    { icon: Award,     value: "Top 5", label: "Class Ranking" },
    { icon: Users,     value: "42",    label: "Classmates" },
  ],
  panelQuote: "Education is the most powerful weapon you can use to change the world.",
};

function getAllowedDestination(portal, from, fallback) {
  if (!from) return fallback;
  if (portal === "student") return from.startsWith("/student-portal") ? from : fallback;
  return from === "/student-portal" ? fallback : from;
}

// ── Left panel ────────────────────────────────────────────────────────────────
function BrandPanel({ config }) {
  const { Icon, badge, panelStats, panelQuote, accentFrom, accentTo } = config;
  return (
    <div
      className="flex flex-col justify-between px-8 py-10 relative overflow-hidden flex-1"
      style={{ background: "transparent" }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full" />
      <div className="absolute bottom-20 -left-16 w-56 h-56 bg-white/5 rounded-full" />
      <div className="absolute top-1/2 right-10 w-32 h-32 bg-white/5 rounded-full" />

      {/* Logo */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/20">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white font-extrabold text-xl leading-tight tracking-tight">WiSchool</p>
            <p className="text-white/50 text-[10px] uppercase tracking-widest font-medium">Scholastify360</p>
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full ring-1 ring-white/20 mb-6">
          <Icon className="w-3.5 h-3.5 text-white/80" />
          <span className="text-xs font-semibold text-white/80 uppercase tracking-wide">{badge}</span>
        </div>

        <h2 className="text-3xl font-extrabold text-white leading-snug mb-3">
          Manage your school<br />smarter, together.
        </h2>
        <p className="text-white/60 text-sm leading-relaxed max-w-xs">
          {panelQuote}
        </p>
      </div>

      {/* Stats */}
      <div className="relative z-10 grid grid-cols-3 gap-3">
        {panelStats.map(({ icon: StatIcon, value, label }) => (
          <div key={label} className="bg-white/10 rounded-2xl p-4 ring-1 ring-white/10 backdrop-blur-sm">
            <StatIcon className="w-5 h-5 text-white/70 mb-2" />
            <p className="text-white font-extrabold text-xl leading-none mb-0.5">{value}</p>
            <p className="text-white/50 text-[11px] leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* Bottom tag */}
      <p className="relative z-10 text-white/30 text-xs mt-6">
        © {new Date().getFullYear()} Scholastify360. All rights reserved.
      </p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Login({ portal = "admin" }) {
  const config = portal === "student" ? STUDENT_CONFIG : ADMIN_CONFIG;
  const { Icon, accentFrom } = config;

  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const redirectTarget = useMemo(
    () => getAllowedDestination(portal, location.state?.from?.pathname || "", config.defaultRoute),
    [config.defaultRoute, portal, location.state],
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email/username and password.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const response = await smsApi.login({ email: email.trim(), password });
      const normalizedUser = setAuthSession({
        token: response?.token,
        user: response?.user,
        emailFallback: email,
        portal,
      });
      if (!config.validateUser(normalizedUser)) {
        clearAuthSession();
        setError(config.invalidRoleMessage);
        return;
      }
      navigate(redirectTarget, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputBase = "w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 placeholder:text-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 focus:bg-white transition-colors";

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Left branding panel — background on the wrapper so it always fills full height */}
      <div
        className="w-[420px] flex-shrink-0 hidden lg:flex flex-col"
        style={{ background: `linear-gradient(160deg, ${config.accentFrom} 0%, ${config.accentTo} 100%)` }}
      >
        <BrandPanel config={config} />
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 overflow-y-auto">
        <div className="w-full max-w-sm">

          {/* Mobile logo (shown only when left panel is hidden) */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: accentFrom }}>
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <p className="font-extrabold text-gray-900 text-lg">WiSchool</p>
          </div>

          {/* Portal badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5 ring-1"
            style={{ background: accentFrom + "15", color: accentFrom, ringColor: accentFrom + "30" }}
          >
            <Icon className="w-3.5 h-3.5" />
            {config.badge}
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">{config.title}</h1>
          <p className="text-sm text-gray-500 mb-7 leading-relaxed">{config.subtitle}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{config.emailLabel}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={config.emailType}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder={config.emailPlaceholder}
                  autoComplete="username"
                  className={inputBase}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <button type="button" className="text-xs font-medium cursor-pointer hover:underline" style={{ color: accentFrom }}>
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={inputBase + " pr-11"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-green-600 cursor-pointer" />
              <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">Keep me signed in</span>
            </label>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0">⚠</span> {error}
              </div>
            )}

            {/* Demo hint */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700 leading-relaxed">
              <strong>Demo credentials:</strong> Email{" "}
              <code className="bg-amber-100 px-1 rounded font-mono">sadeeq@test.com</code>{" "}
              with any password.
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-60 cursor-pointer shadow-sm hover:shadow-md active:scale-[0.99]"
              style={{ background: `linear-gradient(135deg, ${accentFrom}, ${config.accentTo})` }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Signing in…
                </span>
              ) : config.submitLabel}
            </button>
          </form>

          {/* Switch portal */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              {config.switchPrompt}{" "}
              <Link to={config.switchRoute} className="font-bold hover:underline" style={{ color: accentFrom }}>
                {config.switchLabel} →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = { portal: PropTypes.string };