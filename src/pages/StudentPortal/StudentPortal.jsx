import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { BookOpenCheck, Calendar, GraduationCap, LogOut, Mail, Phone, UserCircle2 } from "lucide-react";
import { smsApi } from "../../services/smsApi";
import { getProfileAvatar } from "../../utils/profileAvatar";
import { getAuthUser } from "../../utils/authSession";

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">{label}</p>
        <p className="text-sm text-gray-800 font-medium break-words mt-0.5">{value || "—"}</p>
      </div>
    </div>
  );
}

InfoRow.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

function StatCard({ icon: Icon, title, value, desc }) {
  return (
    <div className="bg-blue-900/50 rounded-2xl p-5 border border-blue-800/50">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-xl bg-blue-700/60 flex items-center justify-center">
          <Icon className="w-4 h-4 text-blue-200" />
        </div>
        <p className="text-blue-200 text-sm font-medium">{title}</p>
      </div>
      <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
      <p className="text-blue-400 text-xs leading-relaxed">{desc}</p>
    </div>
  );
}

StatCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
};

export default function StudentPortal() {
  const navigate = useNavigate();
  const authUser = getAuthUser();
  const [studentRecord, setStudentRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await smsApi.getStudentSelf();
        if (active) setStudentRecord(data || null);
      } catch {
        // Use auth user fallback
      } finally {
        if (active) setIsLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, []);

  const displayName = studentRecord?.name || authUser?.fullName || authUser?.username || "Student";
  const avatar = getProfileAvatar(displayName, "Student");
  const className = studentRecord?.className || studentRecord?.class || "Not assigned";
  const admissionNo = studentRecord?.admissionNumber || studentRecord?.studentId || "Pending";
  const email = studentRecord?.email || authUser?.email || "—";
  const phone = studentRecord?.phone || studentRecord?.mobileNumber || "—";

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(160deg, #0e3a69 0%, #0c2d54 50%, #071d38 100%)" }}
    >
      {/* Top bar */}
      <div className="border-b border-blue-800/50 px-5 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold leading-tight text-sm">WiSchool</p>
              <p className="text-blue-400/60 text-[9px] uppercase tracking-widest">Student Portal</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/logout")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-800/60 border border-blue-700/50 text-blue-200 rounded-xl hover:bg-blue-700/50 text-sm font-medium cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-blue-700 border-t-blue-300 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile card */}
            <div className="bg-blue-900/40 border border-blue-800/40 rounded-3xl p-6 text-center">
              <img
                src={avatar}
                alt={displayName}
                className="w-24 h-24 rounded-2xl mx-auto mb-4 object-cover ring-4 ring-blue-700/50"
              />
              <h2 className="text-xl font-bold text-white mb-0.5">{displayName}</h2>
              <p className="text-blue-400 text-sm mb-4">{authUser?.username || "Student Account"}</p>

              <div className="bg-blue-800/40 rounded-xl px-4 py-2 text-center mb-5 inline-block w-full">
                <span className="text-blue-200 text-xs font-medium">Class: </span>
                <span className="text-white text-sm font-bold">{className}</span>
              </div>

              <div className="text-left">
                <InfoRow icon={Mail} label="Email" value={email} />
                <InfoRow icon={Phone} label="Phone" value={phone} />
                <InfoRow icon={BookOpenCheck} label="Admission No." value={admissionNo} />
                <InfoRow icon={UserCircle2} label="Student ID" value={studentRecord?.studentId || "—"} />
              </div>
            </div>

            {/* Main content */}
            <div className="lg:col-span-2 space-y-5">
              {/* Welcome */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-6 border border-blue-500/50 shadow-lg shadow-blue-900/40">
                <p className="text-blue-200 text-sm mb-1">Welcome back,</p>
                <h1 className="text-2xl font-extrabold text-white mb-2">{displayName.split(" ")[0]} 👋</h1>
                <p className="text-blue-200 text-sm leading-relaxed">
                  You're logged in to the WiSchool student portal. Academic records, timetables, and fee details are managed by your class administrator.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                  icon={BookOpenCheck}
                  title="Class"
                  value={className}
                  desc="Your current assigned class for this academic session."
                />
                <StatCard
                  icon={Calendar}
                  title="Session"
                  value="2025/2026"
                  desc="Active academic session. Term 1 is in progress."
                />
                <StatCard
                  icon={GraduationCap}
                  title="Admission"
                  value={admissionNo}
                  desc="Your unique school admission number."
                />
              </div>

              {/* Notice */}
              <div className="bg-blue-900/40 border border-blue-800/40 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-3">Important Notes</h3>
                <ul className="space-y-2">
                  {[
                    "Use the Student Login route (/student-login) when accessing the portal.",
                    "For profile updates or missing class details, contact your class administrator.",
                    "Always sign out after each session, especially on shared devices.",
                    "For fee payments, visit the Online Payment section on the school website.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-blue-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}