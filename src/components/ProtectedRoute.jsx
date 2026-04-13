import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { getDefaultPrivateRoute, isAdminUser, isStudentUser } from "../config/accessControl";
import { smsApi } from "../services/smsApi";
import { clearAuthSession, getAuthToken, getAuthUser, setAuthSession } from "../utils/authSession";

/**
 * ProtectedRoute blocks access to authenticated routes and enforces
 * portal-specific access so student accounts cannot open admin pages.
 */
const ProtectedRoute = ({ children, portal = "admin", redirectTo = "" }) => {
  const token = getAuthToken();
  const authUser = getAuthUser();
  const location = useLocation();
  const loginRoute = redirectTo || (portal === "student" ? "/student-login" : "/admin-login");
  const [authState, setAuthState] = useState(() => (token && authUser ? "checking" : "unauthenticated"));
  const authUserSignature = authUser ? `${authUser.email || ""}:${authUser.role || ""}` : "";

  useEffect(() => {
    let active = true;

    async function verifySession() {
      const currentUser = getAuthUser();

      if (!token || !currentUser) {
        if (active) {
          setAuthState("unauthenticated");
        }
        return;
      }

      try {
        const response = await smsApi.me();

        if (!active) {
          return;
        }

        setAuthSession({
          token,
          user: response?.user || currentUser,
          emailFallback: currentUser.email,
        });
        setAuthState("authenticated");
      } catch {
        clearAuthSession();

        if (active) {
          setAuthState("unauthenticated");
        }
      }
    }

    verifySession();

    return () => {
      active = false;
    };
  }, [authUserSignature, token]);

  if (authState === "checking") {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl px-6 py-5 text-center">
          <p className="text-sm text-slate-500">Checking your session...</p>
        </div>
      </div>
    );
  }

  if (!token || !authUser || authState === "unauthenticated") {
    return <Navigate to={loginRoute} state={{ from: location }} replace />;
  }

  if (portal === "student" && !isStudentUser(authUser)) {
    return <Navigate to={getDefaultPrivateRoute(authUser)} replace />;
  }

  if (portal === "admin" && !isAdminUser(authUser)) {
    return <Navigate to={getDefaultPrivateRoute(authUser)} replace />;
  }

  return children;
};

export default ProtectedRoute;

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  portal: PropTypes.string,
  redirectTo: PropTypes.string,
};
