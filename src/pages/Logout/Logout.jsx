import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { getLoginRouteForUser } from "../../config/accessControl";
import { smsApi } from "../../services/smsApi";
import { clearAuthSession, getAuthUser } from "../../utils/authSession";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    const authUser = getAuthUser();
    const redirectTo = getLoginRouteForUser(authUser || {});

    async function runLogout() {
      try {
        await smsApi.logout();
      } catch {
        // Session may already be expired — clear locally regardless
      } finally {
        clearAuthSession();
        if (active) {
          // Brief delay so the animation is visible
          setTimeout(() => navigate(redirectTo, { replace: true }), 800);
        }
      }
    }

    runLogout();
    return () => { active = false; };
  }, [navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #0d3321 0%, #0a4020 50%, #061a10 100%)",
      }}
    >
      {/* Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center">
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-green-600/80 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-900/60">
          <GraduationCap className="w-9 h-9 text-white" />
        </div>

        {/* Spinner */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-green-900/40" />
          <div className="absolute inset-0 rounded-full border-4 border-t-green-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>

        <p className="text-white text-lg font-semibold mb-1">Signing you out…</p>
        <p className="text-green-400/60 text-sm">Your session is being cleared safely.</p>
      </div>
    </div>
  );
}