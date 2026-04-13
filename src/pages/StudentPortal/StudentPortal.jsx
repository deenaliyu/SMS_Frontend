import { BookOpenCheck, CalendarDays, LogOut, Mail, Phone, UserCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { smsApi } from "../../services/smsApi";
import { getProfileAvatar } from "../../utils/profileAvatar";
import { getAuthUser } from "../../utils/authSession";

export default function StudentPortal() {
  const navigate = useNavigate();
  const authUser = getAuthUser();
  const [studentRecord, setStudentRecord] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadStudentRecord() {
      try {
        const response = await smsApi.getStudentSelf();

        if (active) {
          setStudentRecord(response || null);
        }
      } catch (error) {
        if (active) {
          setErrorMessage(error.message || "Unable to load your student profile.");
        }
      }
    }

    loadStudentRecord();

    return () => {
      active = false;
    };
  }, []);

  const displayName = studentRecord?.name || authUser?.fullName || authUser?.name || authUser?.username || "Student";
  const profileImage = getProfileAvatar(displayName, "Student");

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-[#0E4C92] text-white px-6 py-5 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-blue-100">Student Portal</p>
            <h1 className="text-3xl font-bold mt-1">Welcome, {displayName}</h1>
          </div>

          <button
            onClick={() => navigate("/logout")}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
            <img src={profileImage} alt={displayName} className="w-28 h-28 rounded-full mx-auto mb-4 object-cover" />
            <h2 className="text-2xl font-semibold text-slate-900">{displayName}</h2>
            <p className="text-sm text-slate-500 mt-1">{authUser?.username || studentRecord?.username || "Student account"}</p>

            <div className="mt-6 space-y-3 text-left">
              <DetailRow icon={Mail} label="Email" value={studentRecord?.email || authUser?.email || "Not provided"} />
              <DetailRow icon={Phone} label="Phone" value={studentRecord?.phone || studentRecord?.mobileNumber || "Not provided"} />
              <DetailRow
                icon={BookOpenCheck}
                label="Class"
                value={studentRecord?.className || studentRecord?.class || "Not assigned"}
              />
              <DetailRow
                icon={UserCircle2}
                label="Admission No."
                value={studentRecord?.admissionNumber || studentRecord?.studentId || "Pending"}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900">Your Account</h3>
              <p className="text-slate-500 mt-2">
                This portal is reserved for student access. Administrative pages are blocked until an admin account signs in.
              </p>

              {errorMessage && <p className="mt-4 text-sm text-red-600">{errorMessage}</p>}

              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <InfoCard
                  icon={CalendarDays}
                  title="Session Access"
                  value="Authenticated"
                  description="Your portal session is active and protected."
                />
                <InfoCard
                  icon={BookOpenCheck}
                  title="Saved Profile"
                  value={studentRecord ? "Connected" : "Basic Account"}
                  description="Student details load from the backend when a saved profile exists."
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-semibold text-slate-900">Next Steps</h3>
              <ul className="mt-4 space-y-3 text-slate-600">
                <li>Use your student login route only: `/student-login`.</li>
                <li>If your class or contact details are missing, update the saved student record from the admin side.</li>
                <li>Use the logout button before switching to an admin account.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-slate-50 px-3 py-3">
      <Icon className="w-4 h-4 text-[#0E4C92] mt-1" />
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
        <p className="text-sm text-slate-800 break-all">{value}</p>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, value, description }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-3">
        <div className="bg-blue-50 text-[#0E4C92] rounded-lg p-2">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-lg font-semibold text-slate-900">{value}</p>
        </div>
      </div>
      <p className="text-sm text-slate-500 mt-3">{description}</p>
    </div>
  );
}

DetailRow.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

InfoCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
