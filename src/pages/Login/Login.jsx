import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Eye, EyeOff, GraduationCap, ShieldCheck } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isAdminUser, isStudentUser } from "../../config/accessControl";
import { smsApi } from "../../services/smsApi";
import { clearAuthSession, setAuthSession } from "../../utils/authSession";

const ADMIN_CONFIG = {
  portal: "admin",
  Icon: ShieldCheck,
  accentColor: "#16a34a",
  accentLight: "#dcfce7",
  title: "Administrator Portal",
  subtitle: "Sign in with your admin credentials to access the management dashboard.",
  emailLabel: "Email Address",
  emailType: "email",
  emailPlaceholder: "admin@wischool.edu.ng",
  submitLabel: "Sign In",
  switchPrompt: "Student?",
  switchRoute: "/student-login",
  switchLabel: "Student Login →",
  defaultRoute: "/dashboard",
  validateUser: isAdminUser,
  invalidRoleMessage: "This portal is for administrators and staff only.",
};

const STUDENT_CONFIG = {
  portal: "student",
  Icon: GraduationCap,
  accentColor: "#1d4ed8",
  accentLight: "#dbeafe",
  title: "Student Portal",
  subtitle: "Sign in with your student credentials to access your portal.",
  emailLabel: "Email or Username",
  emailType: "text",
  emailPlaceholder: "student@wischool.edu.ng",
  submitLabel: "Sign In as Student",
  switchPrompt: "Administrator?",
  switchRoute: "/admin-login",
  switchLabel: "Admin Login →",
  defaultRoute: "/student-portal",
  validateUser: isStudentUser,
  invalidRoleMessage: "This portal is for students only.",
};

function getAllowedDestination(portal, from, fallback) {
  if (!from) return fallback;
  if (portal === "student") return from.startsWith("/student-portal") ? from : fallback;
  return from === "/student-portal" ? fallback : from;
}

export default function Login({ portal = "admin" }) {
  const config = portal === "student" ? STUDENT_CONFIG : ADMIN_CONFIG;
  const { Icon, accentColor, accentLight } = config;

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

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: `linear-gradient(135deg, #0d3321 0%, #0a4020 40%, #061a10 100%)`,
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-green-400/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-green-600/5 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo row */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-900/50">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-tight">WiSchool</p>
            <p className="text-green-400/60 text-[10px] uppercase tracking-widest">Scholastify360</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Card top accent */}
          <div className="h-1.5 w-full" style={{ background: accentColor }} />

          <div className="px-8 py-8">
            {/* Portal badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
              style={{ backgroundColor: accentLight, color: accentColor }}
            >
              <Icon className="w-3.5 h-3.5" />
              {config.title}
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">{config.subtitle}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {config.emailLabel}
                </label>
                <input
                  type={config.emailType}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder={config.emailPlaceholder}
                  autoComplete="username"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ "--tw-ring-color": accentColor + "40" }}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent"
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

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Hint for dev */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700 leading-relaxed">
                <strong>Demo:</strong> Email <code className="bg-amber-100 px-1 rounded">sadeeq@test.com</code> with any password.
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-60 cursor-pointer shadow-lg"
                style={{ backgroundColor: accentColor }}
              >
                {isSubmitting ? "Signing in…" : config.submitLabel}
              </button>
            </form>

            {/* Switch portal */}
            <p className="text-center text-xs text-gray-400 mt-5">
              {config.switchPrompt}{" "}
              <Link to={config.switchRoute} className="font-semibold" style={{ color: accentColor }}>
                {config.switchLabel}
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-green-500/40 text-xs mt-6">
          © {new Date().getFullYear()} Scholastify360 — School Management System
        </p>
      </div>
    </div>
  );
}

Login.propTypes = { portal: PropTypes.string };