import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLoginRouteForUser } from "../../config/accessControl";
import { smsApi } from "../../services/smsApi";
import { clearAuthSession, getAuthUser } from "../../utils/authSession";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const authUser = getAuthUser();
    const redirectTo = getLoginRouteForUser(authUser || {});

    async function runLogout() {
      try {
        await smsApi.logout();
      } catch {
        // Clear the client session even if the backend token is already gone.
      } finally {
        clearAuthSession();

        if (isMounted) {
          navigate(redirectTo, { replace: true });
        }
      }
    }

    runLogout();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-lg px-6 py-8 shadow-sm text-center">
        <h1 className="text-xl font-semibold text-gray-900">Logging out...</h1>
        <p className="text-sm text-gray-500 mt-2">Your session is being cleared.</p>
      </div>
    </div>
  );
}
