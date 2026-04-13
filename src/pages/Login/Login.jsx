import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { FaEye, FaEyeSlash, FaUserGraduate, FaUserShield } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isAdminUser, isStudentUser } from "../../config/accessControl";
import { smsApi } from "../../services/smsApi";
import { clearAuthSession, setAuthSession } from "../../utils/authSession";
import "./login.css";

const initialCredentials = {
  email: "",
  password: "",
};

const portalConfig = {
  admin: {
    badgeIcon: FaUserShield,
    badgeClassName: "bg-[#09B451]",
    buttonClassName: "bg-[#09B451] hover:opacity-80",
    focusClassName: "focus:ring-[#09B451]",
    forgotClassName: "text-[#09B451]",
    accentTextClassName: "text-[#A5FFB9]",
    overlayStyle: {},
    portalName: "Administrator Login",
    portalSubTitle: "Admin Portal",
    switchPrompt: "Are you a student?",
    switchRoute: "/student-login",
    switchLabel: "Student Login",
    forgotMessage: "Password reset is not self-service yet. Please contact the system administrator.",
    emailLabel: "Email Address",
    emailPlaceholder: "Enter admin email",
    emailType: "email",
    submitLabel: "Login as Admin",
    defaultRoute: "/dashboard",
    validateUser: isAdminUser,
    invalidRoleMessage: "This login is for admins and staff only.",
  },
  student: {
    badgeIcon: FaUserGraduate,
    badgeClassName: "bg-[#1565C0]",
    buttonClassName: "bg-[#1565C0] hover:opacity-80",
    focusClassName: "focus:ring-[#1565C0]",
    forgotClassName: "text-[#1565C0]",
    accentTextClassName: "text-[#A5D8FF]",
    overlayStyle: { backgroundColor: "#001B4FCC" },
    portalName: "Student Login",
    portalSubTitle: "Student Portal",
    switchPrompt: "Are you an admin?",
    switchRoute: "/admin-login",
    switchLabel: "Admin Login",
    forgotMessage: "Please contact your school administrator to reset your password.",
    emailLabel: "Email or Username",
    emailPlaceholder: "Enter student email or username",
    emailType: "text",
    submitLabel: "Login as Student",
    defaultRoute: "/student-portal",
    validateUser: isStudentUser,
    invalidRoleMessage: "This login is for students only.",
  },
};

function getAllowedDestination(portal, fromPathname, fallbackPath) {
  if (!fromPathname) {
    return fallbackPath;
  }

  if (portal === "student") {
    return fromPathname.startsWith("/student-portal") ? fromPathname : fallbackPath;
  }

  return fromPathname === "/student-portal" ? fallbackPath : fromPathname;
}

export default function Login({ portal = "admin" }) {
  const currentPortal = portalConfig[portal] ? portal : "admin";
  const config = portalConfig[currentPortal];
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState(initialCredentials);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTarget = useMemo(() => {
    const fromPathname = location.state?.from?.pathname || "";
    return getAllowedDestination(currentPortal, fromPathname, config.defaultRoute);
  }, [config.defaultRoute, currentPortal, location.state]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!credentials.email.trim() || !credentials.password.trim()) {
      setErrorMessage("Email/username and password are required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await smsApi.login(credentials);
      const normalizedUser = setAuthSession({
        token: response?.token,
        user: response?.user,
        emailFallback: credentials.email,
        portal: currentPortal,
      });

      if (!config.validateUser(normalizedUser)) {
        clearAuthSession();
        setErrorMessage(config.invalidRoleMessage);
        return;
      }

      navigate(redirectTarget, { replace: true });
    } catch (error) {
      setErrorMessage(error.message || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    setErrorMessage(config.forgotMessage);
  };

  const BadgeIcon = config.badgeIcon;

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: "url('/login.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="login-container-overlay" style={config.overlayStyle}></div>

      <div className="relative z-10 flex md:flex-row flex-col md:items-start sm:items-center gap-10 justify-center w-full p-4">
        <div className="text-white flex flex-col justify-center items-center text-center">
          <img src="/logo.png" alt="Logo" className="w-34 h-34 md:mb-6" />
          <h1 className={`text-[60px] font-bold leading-tight ${config.accentTextClassName}`}>WELCOME</h1>
          <p className={`text-lg font-medium mt-1 ${config.accentTextClassName}`}>{config.portalSubTitle}</p>
        </div>

        <div>
          <div className="bg-white p-8 rounded-lg shadow-lg lg:w-[456px]">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
              <div className={`${config.badgeClassName} p-2 rounded-full`}>
                <BadgeIcon className="text-white text-lg" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Portal</p>
                <h2 className="text-gray-800 font-bold text-base leading-tight">{config.portalName}</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  {config.emailLabel}
                </label>
                <input
                  className={`shadow appearance-none border border-[#989E99] rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${config.focusClassName}`}
                  id="email"
                  name="email"
                  type={config.emailType}
                  value={credentials.email}
                  onChange={handleChange}
                  placeholder={config.emailPlaceholder}
                  autoComplete="username"
                />
              </div>

              <div className="mb-2 relative">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  className={`shadow appearance-none border border-[#989E99] rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${config.focusClassName}`}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-10 text-gray-600"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEye color="black" /> : <FaEyeSlash color="black" />}
                </button>
              </div>

              {errorMessage && (
                <p className="text-red-600 text-sm mt-2 mb-3" role="alert">
                  {errorMessage}
                </p>
              )}

              <div className="flex items-center justify-between mb-6 mt-3">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className={`font-bold text-sm hover:opacity-70 cursor-pointer ${config.forgotClassName}`}
                >
                  Forgot Password?
                </button>
              </div>

              <button
                className={`${config.buttonClassName} w-full text-white font-semibold py-3 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-60 transition-opacity`}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : config.submitLabel}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              {config.switchPrompt}{" "}
              <Link to={config.switchRoute} className="text-[#09B451] font-semibold hover:underline">
                {config.switchLabel}
              </Link>
            </p>
          </div>

          <div className="text-white text-left p-2 text-[16px]">
            <p>
              <span className="font-bold text-[20px] mr-2">&copy;</span>
              {new Date().getFullYear()} Scholastify360 School Management System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  portal: PropTypes.string,
};
